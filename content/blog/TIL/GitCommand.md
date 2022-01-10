---
title: 'Git 명령어'
date: 2021-01-15 17:21:13
category: 'TIL'
draft: false
---
Git을 사용하기 위한 Tool로는 sourcetree, fork 같은 GUI 클라이언트나 window 환경에서 cmd.exe, mac 환경에서 Terminal.app 같은 터미널 프로그램이 있다.  
나는 cmd 창에서 직접 명령어를 입력하는 것을 선호하는 편이다. 그 이유는 명확하다.  
GUI tool은 시각적으로 확인할 수 있는 점에서 정말 편하고 좋다. 하지만 내가 쉽게 누르는 그 버튼들이 실제로 어떤 명령어를 통해 동작하는 것인지 나는 알지 못한다.  
GUI tool이 없으면 Git을 사용하지 못할 거 같은 기분이라고나 할까? 그러는 의미에서 자주 쓰는 명령어를 정리해볼까 한다.

## git config 관련
### 1. git 계정 설정
```text
git config --global user.name "{user id}"
git config --global user.email "{user email address}"
```
모든 프로젝트에 공통적으로 사용되는 global 설정인 Git 계정 이름과 이메일 주소를 등록하는 명령어이다.  
만약 프로젝트마다 다른 계정을 사용해야한다면, 아래와 같이 하면 된다.
```text
git config --local user.name "{user id}"
git config --local user.email "{user email address}"
```
### 2. alias 설정
```text
git config --global alias.{alias 명} {alias 주고 싶은 명령어}
ex) git config --global alias.s status
```
현재 git 상태를 확인하기 위해 "git status" 라고 명령어를 입력해야하는데 alias를 위와 같이 주면 "git s" 만 입력해도 git status가 실행된다.

### 3. config 설정 확인
```text
git config --list
```

## git branch 관련
### 1. 연동하기
```text
git branch --set-upstream-to {remote branch alias}/{local branch name}
```
local 브랜치를 remote 브랜치와 연동할 때 사용한다.   
"git push origin master" 라고 입력하는 것을 "git push" 만 입력해도 가능하도록 해준다.

### 2. branch 생성
```text
git checkout -b {branch name}
```
현재 브랜치를 기준으로 새로운 브랜치를 생성과 동시에 이동한다.
```text
git checkout -t {branch name} {remote branch name}
```
remote 브랜치와 같은 이름의 local 브랜치를 생성한다.

### 3. branch 삭제
```text
git branch --delete {branch name}
git branch -D {branch name}
```
--delete 옵션을 사용해서 로컬 브랜치를 삭제할 수 있다. 강제적으로 삭제하려고 할때는 -D 옵션을 사용한다.
```text
git push {remote repository alias} :{branch name}
```
원격 저장소에 있는 branch를 삭제하기 위해서는 위와 같이 사용한다.

### 4. commit 가져오기
```text
git cherry-pick {commit hash}
```
특정 브랜치에서 원하는 커밋을 가져올 때 사용한다.  
충돌이 생긴 경우 충돌을 제거하거나 cherry-pick을 중단해야한다.  
중단하려면 --abort 옵션을 사용하고, 충돌을 제거한 후 계속 진행하려면 --continue 옵션을 사용한다.

## stash 관련
### 1. 하던 작업 임시 저장하기
```text
git stash
```
작업 중에 다른 요청이 들어와서 브랜치를 변경해야 할 때, 아직 마무리되지 않은 작업을 커밋하는 것은 좀 찝찝한 일이다. 이럴 때 위와 같은 명령어로 스택에 임시 저장해둘 수 있다.

### 2. 임시 저장한 작업 가져오기
```text
git stash apply [stash 번호]
```
apply 명령어를 통해 임시 저장했던 작업물들을 가져온다.
--index 옵션을 사용하면 staged 상태까지 복원해준다.

### 3. stash 제거하기
```text
git stash drop [stash 번호]
```
apply 명령어는 단순히 stash에 저장된 내용을 적용시킬뿐 스택에서 지우진 않는다. 그래서 drop 명령어를 사용해서 스택에 남아 있는 stash를 제거할 수 있다.

### 4. apply + drop
```text
git stash pop
```
apply와 drop 명령어가 합쳐진 형태  

더 많은 명령어가 있지만 보통 이렇게 많이 쓰는 것 같다.  
merge 관련된 명령어는 merge 과정을 정리하면서 작성해야겠다.