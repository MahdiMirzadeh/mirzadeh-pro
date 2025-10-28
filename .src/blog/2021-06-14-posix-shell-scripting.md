<!---
title: POSIX Shell Scripting
description: Why I use POSIX shell for everything and why you should too (2021).
--->

Shell scripting gets a bad reputation. "It's hard to read." "It's error-prone." "Use Python instead." I disagree.

POSIX shell is one of the most powerful tools you can learn. It's fast, portable, and always available. Every Unix-like system has `/bin/sh`. You don't need to install runtimes, manage dependencies, or worry about version mismatches. It just works.

## Why POSIX shell?

### 1. Portability

POSIX shell runs everywhere: Linux, BSD, macOS, even embedded systems. Write your script once and it works on any POSIX-compliant system. No virtualenvs, no Gemfiles, no package.json. Just a shebang and you're done.

```sh
#!/bin/sh
# This runs on any POSIX system
```

Compare that to Python (2 vs 3), Ruby (rbenv/rvm chaos), or Node (nvm, different module systems). Shell doesn't care. It's been stable for decades.

### 2. Speed

Shell is fast. It's designed to orchestrate programs, not to be a general-purpose language. You pipe data between tools, each doing one thing well. No interpreter startup overhead, no GC pauses, no framework bloat.

For system tasks (file manipulation, process management, text processing), shell is often faster than high-level languages because you're calling optimized C programs (grep, sed, awk) directly.

### 3. Minimalism

A good shell script is small. You use existing tools instead of reinventing them. Need to parse JSON? Use `jq`. Need to download a file? Use `curl`. Need to process text? Use `sed` or `awk`.

This is the Unix philosophy: small, composable tools that do one thing well. Shell is the glue.

### 4. No dependencies

Your shell script has zero runtime dependencies beyond coreutils (which every system has). No `requirements.txt`, no `Cargo.toml`, no `go.mod`. It runs on a fresh install. It runs in a minimal container. It runs on a 10-year-old server.

### 5. Interactivity

Shell is your working environment. You test commands interactively, then paste them into a script. The feedback loop is instant. No compile step, no "activate this environment first," no IDE setup. Just type and run.

## Common complaints (and why they're wrong)

**"Shell is hard to read."**  
Only if you write bad shell. Use meaningful variable names, add comments, break long pipelines into functions. Good shell is readable.

**"Shell is error-prone."**  
Set `set -euf` at the top of your scripts. Use [ShellCheck](https://github.com/koalaman/shellcheck) to catch bugs before you run. Problem solved.

**"Shell can't do X."**  
Then call a program that can. That's the point. Shell orchestrates; specialized tools do the work.

**"But Python is more powerful!"**  
For complex logic, sure. But most scripts are glue: "download this, extract that, move these files." Shell does this in 10 lines. Python takes 50 and imports three libraries.

## ShellCheck: the linter you need

If you write shell, use [ShellCheck](https://github.com/koalaman/shellcheck). It's a static analysis tool that catches common mistakes: unquoted variables, useless cats, broken conditionals, portability issues.

```sh
# Bad
for f in $(ls *.txt); do
  echo $f
done

# ShellCheck warns: Don't parse ls. Use globs.
# Also: quote your variables.

# Good
for f in ./*.txt; do
  [ -e "$f" ] || continue
  echo "$f"
done
```

ShellCheck makes you a better shell programmer. Run it in CI. Run it in your editor. Treat warnings as errors.

## Example: a simple build script

Here's a script that builds a static site (like this one):

```sh
#!/bin/sh
set -euf

SRC="src"
OUT="out"

rm -rf "$OUT"
mkdir -p "$OUT"

for md in "$SRC"/*.md; do
  [ -e "$md" ] || continue
  base=$(basename "$md" .md)
  out="$OUT/$base.html"
  
  cat template/header.html > "$out"
  markdown < "$md" >> "$out"
  cat template/footer.html >> "$out"
done

echo "Built $(find "$OUT" -name '*.html' | wc -l) pages."
```

That's it. No Makefile, no npm scripts, no bundler config. Just a shell script you can read and modify.

## When *not* to use shell

Shell is great for glue and orchestration. It's not great for:

- Complex data structures (use awk, Python, or a real language)
- Heavy string manipulation (use sed/awk or Perl)
- Cross-platform GUI apps (obviously)
- Performance-critical algorithms (use C, Rust, Go)

Know your tools. Shell is one tool in the box. Use it where it shines.

## My shell scripts

I practice what I preach. Here are some POSIX shell scripts I've written:

- [**Kaveh**](https://github.com/MahdiMirzadeh/kaveh): A lightweight static site generator written in pure POSIX shell. Converts Markdown to responsive HTML with zero external dependencies. This website is built with it.

- [**dumbsh**](https://github.com/MahdiMirzadeh/dumbsh): Fixes keyboard layout mistakes. If you type in the wrong layout by accident, this script generates a translation table using xmodmap to convert second-layout text back to your first layout (English).

- [**qbittorrent themes**](https://github.com/MahdiMirzadeh/qbittorrent): Generates color themes for qBittorrent (Qt client and WebUI) using shell scripts. Because even your torrent client should look good.

All pure shell. All portable. All maintainable.

## Conclusion

POSIX shell is underrated. It's fast, portable, minimal, and always available. Learn it well and you won't need a "task runner" fad.

Write clean shell. Use ShellCheck. Keep scripts small. Embrace the Unix philosophy.

Your system already has what you need. Use it.
