<!---
title: Who I Am and My GNU/Linux Journey
description: A short introduction and the timeline of my path through GNU/Linux, suckless tools, and the BSDs (2016–2022).
--->

Hi, I’m Mahdi Mirzadeh. I was born in 2003 and I live in Iran. I care deeply about computers, systems, and the craft of building with them. I’m a FOSS enthusiast and I’ve used GNU/Linux as my daily driver since 2016.

## GNU+Linux is not just an OS, it’s a journey

Below is the path I took through Unix-like systems. It’s less about “which distro is best” and more about learning, breaking things, and building a setup that fits me.

### Early 2016 - First install
- Dual‑booted Ubuntu 14.04 LTS (Unity) with a debloated Windows 7 x86.
- Used Ubuntu for web and media; Windows for Counter‑Strike 1.6.
- Mostly experimenting, browsing docs, and doing small web freelance work.

### Late 2016 - I broke the bootloader
- Deleted the Ubuntu partition from Windows Disk Management (don’t do this).
- Reboot… no OS. Without a Manjaro USB ready, I ended up back on a fresh Windows 7 for a while.

### 2017 - Back to Linux
- New laptop didn’t support Windows 7 well, so I installed Windows 10 x64.
- Used it to download Manjaro and continued my GNU/Linux journey in earnest.

### 2019 - Down the rabbit hole
- Studied LPIC topics, networking, Bash scripting; played with servers; wrote more C.
- Joined Linux communities; got curious about tooling and workflows.
- Switched to Arch (I didn’t say “btw”).
- Window‑manager hopping began:
  - 2019: xfce → spectrwm → i3‑wm → qtile → xmonad → bspwm / openbox → dwm (by 2021)

### 2021 - Suckless and minimalism
- Adopted the [suckless philosophy](http://suckless.org/philosophy/); avoided bloat.
- Built and maintained my own patches/builds for [dwm](https://git.mirzadeh.pro/dwm), [st](https://git.mirzadeh.pro/st), [tabbed](https://git.mirzadeh.pro/tabbed), [surf](https://git.mirzadeh.pro/surf), [dmenu](https://git.mirzadeh.pro/dmenu), [slock](https://git.mirzadeh.pro/slock), [mksh](https://git.mirzadeh.pro/mksh), [neatvi](https://git.mirzadeh.pro/neatvi), etc.
- Moved heavily to CLI/TUI workflows (see my [dotfiles](https://git.mirzadeh.pro/dotfiles)).
- Distro path: ArchLinux → AlpineLinux → FreeBSD | OpenBSD (2022).

### Mid 2021 - Late 2022 - Towards Rostam Linux
- I began laying the groundwork for my own OS by bootstrapping packaging infrastructure.
- Binary mirror and automated builder: [RostamOS/packages](https://github.com/RostamOS/packages)
  - Automates building/updating packages (incl. AUR) roughly every 24h
  - Publishes a pacman repository you can add to `/etc/pacman.conf`
- "Rostam‑exclusive" packages (sources/PKGBUILDs): [RostamOS/rostam-packages](https://github.com/RostamOS/rostam-packages)

How it works, briefly:
- PKGBUILD‑driven builds scheduled by scripts/CI
- Outputs x86_64 packages, generates the repo database, and serves it as a static pacman repo
- Follows a minimal, reproducible setup with small, focused packages

### Mid 2022 - Unix, for real
- Daily‑drove OpenBSD on my PC and FreeBSD on my laptop.
- Learned more about kernel patching, the BSDs’ design, and the Unix way.

Subscribe to the blog to learn more about this work and future updates on Rostam Linux.

