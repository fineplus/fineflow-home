# 开发者指南

注意：需要将多个项目都统一放一个文件夹下
![alt text](/projects.png)

## 1.文档官网

### 克隆代码
```shell
git clone https://github.com/fineplus/fineflow-home.git
cd fineflow-home
npm install
```

### 预览
```shell
npm run doc:dev
```

### 编译
```shell
npm run doc:build
```

## 2.fineflow前端

### 克隆代码
```shell
git clone https://github.com/fineplus/fineflow.git
cd fineflow
npm install
```

### 预览
```shell
npm run dev
```

### 前端编译
```shell
npm run build
```

### 编译给tauri
```shell
npm run build-for-tauri
```

## 3.fineflow-tauri

### 克隆代码
```shell
git clone https://github.com/fineplus/fineflow-tauri.git
cd fineflow-tauri
npm install
```

### 预览

先在fineflow项目使用npm run build-for-tauri打包得到tauri-dist
用tauri-dist内的index.html文件和assets文件替换到fineflow-tauri的src文件夹下

```shell
npm tauri dev
```

### 编译为exe

```shell
npm tauri build
```


## 4.fineflow-api

### 克隆代码
```shell
git clone https://github.com/fineplus/fineflow-api.git
cd fineflow-api
pip install -r requirements.txt
```

### 启动
```shell
python main.py
```

### 打包exe
```shell
pip install pyinstaller
pyinstaller.exe -F .\main.py --onefile  --icon logo.png  --name fineflow-api
```

### 一次打包所有工程(建议)
```shell
pip install pyinstaller
python make_utils.py
```