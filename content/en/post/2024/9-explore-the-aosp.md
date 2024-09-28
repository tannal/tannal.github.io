---
title: Explore the AOSP Project
date: 2024-09-27 19:23:11+0000
categories:
    - open source
tags:
    - Open Source
    - Documentry
---

##  Build the AOSP Project

The Android Open Source Project (AOSP) is an open-source software stack for mobile devices, and a corresponding open-source project led by Google. It is the base of the Android operating system. The AOSP code can be found at [android.googlesource.com](https://android.googlesource.com/).


### Install the required packages

```bash
sudo apt-get install git-core gnupg flex bison gperf build-essential zip curl zlib1g-dev gcc-multilib g++-multilib libc6-dev-i386 lib32ncurses5-dev x11proto-core-dev libx11-dev lib32z1-dev libgl1-mesa-dev libxml2-utils xsltproc unzip
```


### Initialize the repository

```bash
PATH=~/bin:$PATH
curl https://storage.googleapis.com/git-repo-downloads/repo > ~/bin/repo
chmod a+x ~/bin/repo
git config --global user.name "tannal"
git config --global user.email "tannal2409@gmail.com"

mkdir aosp

repo init -u https://android.googlesource.com/platform/manifest
repo sync

source build/envsetup.sh
```

### Build the code

```bash
lunch
make -j 22

```


### Android Cuttlefish Emulator

The Android Cuttlefish Emulator is a virtual device that runs the Android operating system. It is used for testing and development purposes. The Android Cuttlefish Emulator can be found at [github.com/google/android-cuttlefish](https://github.com/google/android-cuttlefish.git)

```bash
git clone https://github.com/google/android-cuttlefish.git
cd android-cuttlefish

tools/buildutils/build_packages.sh

sudo apt install ./cuttlefish-base_*.deb ./cuttlefish-user_*.deb

sudo usermod -aG kvm,cvdnetwork,render $USER

sudo reboot

cvd create
cvd start --start_webrtc=true
```

## A rooted phone

My XiaoMi8

Chrome use sqlite3 to store the data, the data is stored in the /data/data/com.android.chrome/databases/ directory. The data is stored in the form of a database file, which can be accessed using the sqlite3 command.

E.G. We can search for browsing history using the following command:

![](./aosp-1.png)

The /data/data/ 



![](aosp-2.png)



![](aosp-3.png)