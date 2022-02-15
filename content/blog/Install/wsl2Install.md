---
title: Docker 설치하기 전에 WSL2 설치 및 활성화
date: 2022-02-04 11:30:00
category: 'Install'
draft: false
---
Docker Desktop은 기본적으로 Hyper-V 기능을 사용하기 때문에 Windows 10 Pro 에디션에서만 사용할 수 있었지만, 
2020년 5월 Windows 업데이트가 릴리스되면서 WSL2가 정식 릴리스 됨에 따라 Windows 10 Home에서도 WSL2를 기반으로 Docker Desktop을 사용하는 것이 가능해졌습니다.</br>
(※ 참고로 WSL은 Windows Subsystem for Linux 2의 줄임말로 윈도우에서 리눅스를 사용할 수 있게 해주는 기능입니다.)</br>

Home 에디션의 경우 Docker를 사용하려면 WSL2가 필수이므로 Docker를 설치하기 전에 WSL2를 먼저 설치하도록 해보겠습니다.
### WSL2를 설치하고 활성화하는 방법
#### 1. Windows Powershell 관리자 권한으로 실행 후, 아래 2개의 명령어 실행
- DISM(배포 이미지 서비스 및 관리) 명령어로 Microsoft-Windows-Subsystem-Linux 기능을 활성화합니다.</br>

```
$ dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
배포 이미지 서비스 및 관리 도구
버전: 10.0.19041.844

이미지 버전: 10.0.19042.1466

기능을 사용하도록 설정하는 중
[==========================100.0%==========================]
작업을 완료했습니다.
```

- DISM 명령어로 VirtualMachinePlatform 기능을 활성화합니다.</br>

```
$ dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
배포 이미지 서비스 및 관리 도구
버전: 10.0.19041.844

이미지 버전: 10.0.19042.1466

기능을 사용하도록 설정하는 중
[==========================100.0%==========================]
작업을 완료했습니다.
```

__주의할 점은 반드시 관리자 권한으로 실행해야 합니다. 터미널이 관리자 권한이 아닌 경우 작업이 실패합니다.!__

#### 2. 윈도우 재부팅합니다.

#### 3. [x64 머신용 최신 WSL2 Linux 커널 업데이트 패키지를 다운로드 받아 설치합니다.](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

#### 4. cmd 창을 열고, 다음 명령어를 실행해 기본적으로 사용할 WSL 버전을 2로 변경해줍니다.
```
wsl --set-default-version 2
WSL 2와의 주요 차이점에 대한 자세한 내용은 https://aka.ms/wsl2를 참조하세요
작업을 완료했습니다.
```

### 참고
https://www.lainyzine.com/ko/article/a-complete-guide-to-how-to-install-docker-desktop-on-windows-10/