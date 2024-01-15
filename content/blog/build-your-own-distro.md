---
title: Build your own linux distribution
date: 2024-01-13
draft: false
---

This post will tell you how to build your own linux distro and boot it with qemu. Debug the kernel with gdb/vscode.

# Build Linux Kernel

## Download kernel source code

```bash

wget https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.7.tar.xz

tar xvf linux-6.7.tar.xz

cd linux-6.7


```

## Config the kernel tree

create a .config file

```bash

https://github.com/tannal/tannal.glitch.me/blob/main/.config_linux_x86_dev

```

## build kernel

```bash
make oldconfig
make -j20

```




# Build and install Glibc

Keep in mind that lld is not support for building glibc.

```bash
wget https://ftp.gnu.org/gnu/glibc/glibc-2.38.tar.gz

tar xvf glibc-2.38.tar.gz

cd glibc-2.38

mkdir build
mkdir GLIBC

cd build

sudo apt install gawk

# llvm lld is not support for compiling glic
sudo rm /usr/bin/ld
sudo ln -s x86_64-linux-gnu-ld /usr/bin/ld


../configure --prefix=

make -j20

make install DESTDIR=../GLIBC

```

Glibc will install in the GLIBC directory.
Next step we need to build busybox.

# sysroot

Create a directory called sysroot for busybox and copy all the GLIBC to the sysroot.

```bash

mkdir sysroot

cd sysroot

mkdir usr

cd ..

cp -r glibc-2.38/GLIBC/* sysroot/

ls sysroot/
bin  etc  include  lib  libexec  sbin  share  var

cp -r GLIBC/include/* sysroot/include/
cp -r GLIBC/lib/* sysroot/lib/

mkdir sysroot/usr
rsync -a /usr/include sysroot

ln -s ../include sysroot/usr/include
ln -s ../lib sysroot/usr/lib

```


# Build busybox

```bash

wget https://git.busybox.net/busybox/snapshot/busybox-1_36_1.tar.bz2

tar xvjf busybox-1_36_1.tar.bz2

cd busybox-1_36_1

make defconfig

CONFIG_SYSROOT="../sysroot"
CONFIG_EXTRA_CFLAGS="-L../sysroot/lib"

```