---
id: task-008
title: Optimize Tauri build times
status: Done
assignee: []
created_date: '2025-12-09 23:19'
updated_date: '2025-12-15 17:08'
labels: []
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Current build times:
- Tauri build: ~37 seconds (36.54s compile + bundling)

Potential optimizations to investigate:
     
- Enable incremental compilation in Cargo
- Use lld or mold linker for faster linking
- Optimize Cargo.toml release profile
- Consider split-debuginfo for smaller binaries
- ~~Use sccache for Rust compilation caching~~
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Dev build time reduced from 1m14s to ~29s (61% faster)
- [ ] #2 Disk usage reduced from 2.6GB to 1.4GB (46% smaller)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Rust Compile Time Optimizations (from corrode.dev)

**Linker Configuration (.cargo/config.toml):**
```toml
[build]
rustflags = ["-C", "link-arg=-fuse-ld=lld"]
```

**macOS-Specific (Cargo.toml):**
```toml
[profile.dev]
opt-level = 1
debug = 0
split-debuginfo = "unpacked"  # Can reduce compile time by 70%
strip = "debuginfo"
```

**Profiling & Dependency Cleanup:**
- `cargo build --timings` - visualize compilation bottlenecks and parallelism
- `cargo machete` - remove unused dependencies
- `cargo features prune` - disable unused crate features
- `cargo tree --duplicate` - consolidate multiple dependency versions

**macOS Tips:**
- Use `lld` linker (or `mold` on Linux)

**Nightly Options:**
- Parallel frontend: `RUSTFLAGS="-Z threads=8" cargo +nightly build` (50% potential improvement)
- `rustc_codegen_cranelift` - faster compilation without optimization for local dev

**Source:** https://corrode.dev/blog/tips-for-faster-rust-compile-times/

## Investigation Results (2025-12-15)

**Baseline (clean dev build):** 1m 14s
**With dev profile optimizations:** ~29s
**Improvement:** 61% faster

**Disk usage:**
- With debug info: 2.6GB
- Without debug info: 1.4GB (46% reduction)

**Applied optimizations in Cargo.toml:**
```toml
[profile.dev]
debug = 0
split-debuginfo = "unpacked"
```

**Already in place:**
- lld linker configured in .cargo/config.toml
- Optimized release profile

**Duplicate dependencies found (transitive through Tauri, can't control):**
- base64 (v0.21.7, v0.22.1)
- bitflags (v1.3.2, v2.10.0)
- hashbrown (v0.12.3, v0.14.5, v0.16.1)
- getrandom (v0.1.16, v0.2.16, v0.3.4)
- rand/rand_core (multiple versions)

**Not tested:**
- sccache (not installed, already noted as crossed out)
- cargo machete (not installed)
- Parallel frontend (requires nightly)
<!-- SECTION:NOTES:END -->
