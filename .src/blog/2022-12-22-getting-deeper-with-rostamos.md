<!---
title: Getting deeper with RostamOS
description: How Arch/Rostam packages and pacman work, and why rostam-packages exists
--->

This post explains, at a high level, how Arch-style packages work, how pacman consumes repositories, and why I maintain both a binary mirror and a source repo for “Rostam‑exclusive” packages.

Links for reference:
- Binary mirror and automation: https://github.com/RostamOS/packages
- Rostam source PKGBUILDs: https://github.com/RostamOS/rostam-packages

## Arch packaging model in brief

- PKGBUILD: a shell recipe describing how to fetch sources, apply patches, build, and package.
- makepkg: builds the package from a PKGBUILD, producing a .pkg.tar.zst (and optionally a .sig).
- repo-add/repo-remove: update the repository database files (e.g., repo.db, repo.files) to index available packages.
- Repository layout: typically per-arch subtree (e.g., x86_64/) containing packages and the repo database.

```
+------------------+     makepkg      +---------------------+
|   PKGBUILD (+)   | ---------------> | .pkg.tar.zst (+sig) |
|  sources/patches |                   +---------------------+
       |                                         |
       v                                  repo-add -> repo.db/.files
+------------------+        publish        +---------------------------+
|   build chroot   | --------------------> |  static repo (x86_64/)   |
+------------------+                       +---------------------------+
```

## How pacman consumes repos

pacman uses libalpm to sync repository databases and resolve transactions.

- Configuration: /etc/pacman.conf lists repositories in priority order.
- Sync: pacman -Sy fetches repo.db(.tar*), optionally repo.files, and signatures if enabled.
- Resolve: pacman computes a transaction (add/remove/upgrade) with dependency solving and conflicts.
- Acquire: packages are downloaded (HTTP), signatures verified (if configured), and then extracted to the filesystem.

```
$ pacman -S foo
   |
   v
[mirrorlist] -> fetch repo.db[.sig]
   |
resolve dependencies -> build transaction
   |
download .pkg.tar.zst[.sig] -> verify -> extract to /
```

A minimal repository config (example; check the packages repo for the current URL):

```
# /etc/pacman.conf
[rostam]
SigLevel = Optional TrustAll
Server = <rostam_repo_url>/$arch
```

## Why Rostam packages exist

- Velocity: prebuilt binaries remove local compile time for common and personal packages.
- Reproducibility: pinned PKGBUILD versions/patches yield predictable builds.
- Curation: slim defaults and opinionated variants aligned with my environment.
- Independence: external projects I rely on (and my own tools) are available even if AUR recipes drift.

## RostamOS repositories

- Binary mirror automation - RostamOS/packages
  - Scripts/CI periodically rebuild a set of packages (including selected AUR) and run repo-add.
  - Artifacts are published in an x86_64/ directory with repo.db/.files for pacman.
- Rostam‑exclusive sources - RostamOS/rostam-packages
  - PKGBUILDs for my forks/patchsets and packages not present in official repos.
  - Built by the same pipeline to land in the binary mirror.

### Build pipeline overview

```
RostamOS/rostam-packages (PKGBUILDs)
            |
            v
       makepkg in clean environment
            |
            v
 .pkg.tar.zst (+ .sig)  -- repo-add -->  repo.db / repo.files
            |                               |
            +----------- publish -----------+
```

For details and the current setup, see the READMEs in the two repositories linked above.
