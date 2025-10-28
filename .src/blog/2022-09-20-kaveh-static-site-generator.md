<!---
title: Kaveh: A Static Site Generator in Pure POSIX Shell
description: How and why I built my own static site generator in 150 lines of shell script (September 2022).
--->

In my [earlier post on static sites](/blog/2022-05-10-why-i-love-static-site-generators.html), I mentioned I use a custom POSIX shell script to build this website. This is that script. It's called [Kaveh](https://github.com/mahdimirzadeh/kaveh), and as of right now it's about 150 lines of shell that converts Markdown to HTML.

## Why build another static site generator?

Because I wanted something I fully understand. No 500-package dependency tree, no framework magic, no "it works but I don't know how." Just a shell script I can read, modify, and trust.

Goals:
- Pure POSIX shell (portable, no runtime dependencies)
- Minimal: one script, no plugins, no config files
- Fast: process files in parallel using `find` and pipes
- Simple: Markdown goes in, HTML comes out

## How Kaveh works (v0.1)

The entire generator is one shell script with an embedded HTML template. Here's the flow:

```
src/*.md  -->  [parse metadata]  -->  [convert to HTML]  -->  out/*.html
                                           |
                                      [apply template]
```

### 1. Parse metadata

Markdown files can include metadata in HTML comments:

```markdown
<!---
title: My Page Title
icon: /favicon.png
description: A brief description
--->

# Page content starts here
```

The script extracts these with `sed`:

```sh
getvalue() { 
    sed -e "/.*<\!---.*KVH.*/,/--->/!d" "$1" \
    | sed -n "/^$2/I p" \
    | sed 's/^.*: //'; 
}
```

Simple pattern matching. No YAML parser needed.

### 2. Convert Markdown to HTML

I use an external Markdown parser (discount's `markdown` command). The script just calls it:

```sh
md2html() { 
    markdown "$1" | sed -e '/.*<\!---.*KVH.*/,/--->/d'; 
}
```

The `sed` removes the metadata comment from the output.

**Why an external parser?**  
Writing a full Markdown parser in shell would be hundreds of lines and slow. The `markdown` command is fast, widely available (discount package on most distros), and does one thing well. That's the Unix way.

### 3. Apply the template

The HTML template is embedded at the end of the script after a `__HTML TEMPLATE__` marker. The generator extracts it, injects the converted Markdown, substitutes variables, and writes the output:

```sh
printf "%s\n" \
    "$(sed '0,/^__HTML TEMPLATE__$/d' "$0" | sed -e '/PAGE_DATA/,//d')" \
    "$(md2html "${FILE}")" \
    "$(sed '0,/^__HTML TEMPLATE__$/d' "$0" | sed -e '0,/%PAGE_DATA%/d')" \
| sed -e "s/%PAGE_TITLE%/${PAGE_NAME}/g" \
      -e "s/%PAGE_DESC%/${PAGE_DESC}/g" \
      -e "s/%PAGE_ICON%/${PAGE_ICON}/g" \
> "${OUTPUT_FILE}"
```

Variables like `%PAGE_TITLE%` are replaced with metadata from the Markdown file or defaults.

### 4. Copy assets

Non-Markdown files (images, CSS, etc.) are copied as-is:

```sh
find "${KVH_SRC}" -type f | while read FILE; do
    [ "${FILE#*.}" = "md" ] || continue  # Skip .md files
    # ... copy to output ...
done
```

That's it. The entire build process.

## The template

The embedded template is minimal: semantic HTML5, a small CSS block (light/dark mode via media query), no JavaScript. It fits in ~80 lines.

Key features:
- Responsive: works on any screen size
- Dark mode: respects `prefers-color-scheme`
- Print-friendly: removes unnecessary styling for print
- View-source friendly: clean, readable HTML

No frameworks, no build step for the CSS, no bloat.

## Usage

```sh
kaveh -i src/ -o out/
```

Defaults to `$PWD/src` and `$PWD/out` if you don't specify.

Run it once, deploy the `out/` directory. No server-side rendering, no runtime, no database.

## Limitations (as of v0.1)

- Requires an external Markdown parser (discount's `markdown` command)
- No built-in pagination or blog index generation
- No automatic sitemap or RSS feed
- Template is embedded, not a separate file

These are acceptable trade-offs for a ~150-line script. If I need more features, I'll add them. If I don't, the script stays simple.

## Performance

On my laptop, Kaveh builds this site (a few pages) in under a second. For larger sites, the bottleneck is the Markdown parser, not the shell script.

Want faster builds? Run in parallel:

```sh
find src/ -name "*.md" | xargs -P 4 -I {} sh -c 'kaveh -i {} -o out/'
```

Shell is great for orchestration like this.

## Philosophy

Kaveh follows the suckless philosophy:
- Simplicity over features
- Clarity over abstraction
- Minimal dependencies

The entire script is readable in one sitting. You can understand how it works, modify it, and trust it. That's more valuable than a feature-rich generator with thousands of lines you'll never read.

## Source

The code is on GitHub: [MahdiMirzadeh/kaveh](https://github.com/mahdimirzadeh/kaveh)

It's MIT licensed. Use it, fork it, modify it. If you find bugs or have ideas, open an issue.

## Conclusion

Static site generators don't need to be complex. Markdown to HTML is a solved problem. You don't need a framework or a runtime to build a website.

A shell script, a Markdown parser, and a template. That's it for now.
