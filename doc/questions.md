## 1. 什么是服务端参数

节点的参数配置中有一个useServer参数，当它为真，则该参数不会被序列化，而是以id的形式传递。

例如后端有一些实例化对象，是无法序列化传递到前端的，但要在流程中传递该怎么做呢？

后端的实现原理是配置为useServer为真时，后端会将对象存入全局字典，然后返回对象在字典中的key，其他节点在执行时，会根据这个key来寻找对象。这个配置只能在后端进行配置，前端节点不需要配置。

## 2. 安全性问题

软件本身不会存在恶意代码，但是由于节点、流程是可以分享的，您可能会导入别的第三方节点或流程，这个时候这些节点和流程的安全性是无法保证的。

但节点、流程中的代码都是明文的，您可以阅读第三方的节点、流程文件内部的代码来判断是否存在安全性问题，若这些第三方节点、流程对您的系统设备造成危害，则和本软件作者无关。

软件存在纯web版本，它则不存在安全性问题，因为它的执行、数据的保存全部都在浏览器内，后续看大家需要我决定是否单独发布这个纯web版本。
纯web版本除了不内置python服务，其他功能都能正常使用。

## 3. fineflow的定位

市面上有非常多的工作流工具，fineflow的不同之处在哪？
其他工作流软件基本都是面向某一个场景的，但fineflow是面向任何场景的，您可以理解为它是一个工作流系统的基础，然后用户在它上面去实现自己想要的工作流系统。
fineflow不是低代码软件，也不是可视化编程软件。它更倾向于共享、简单、易用。它只是在规范一种工作流的形式，然后用户根据这个形式去设计一些对自己有用的东西。

fineflow是一个让用户自己设计自己工作流和节点的软件。

它的所有节点您都可以删除，然后从零开始设计属于您自己的节点库、工作流库。

## 4. 是否开源

pyfineflow库是开源的，开发者可以参考这个库去实现别的开发语言的库。但前端部分和api部分未开源，原因还是希望工作流的节点形式能有一个规范规定，如果开源可能会出现各种版本各种分支。

## 5. 如何快速刷新后端节点

可以使用jurigged热更新库来实现

1. 安装jurigged库
```shell
pip install jurigged
```
2. 在main.py增加start_hotreload函数并调用
```python
# main.py
from app import fine
import builtins

######### 增加的部分
def start_hotreload():
    import jurigged
    open_org = builtins.open

    def custom_open(file, mode='r', buffering=-1, encoding='utf-8', errors=None, newline=None, closefd=True,
                    opener=None):
        return open_org(file, mode, buffering, encoding, errors, newline, closefd, opener)

    builtins.open = custom_open

    jurigged.watch()


start_hotreload()
######### 


def init():
    import math_nodes
    _ = math_nodes


init()

fine.init_server(port=8081)
```
3. 当server后端修改代码或增加了一些节点后保存代码文件，它会自动更新无需重启后端
4. 在fineflow前端，使用快捷键ctrl+shift+F来刷新节点即可看到节点的更新。

::: tip
注意，该热更新库很方便，但注意可能它会存在一些问题，最好还是可以重启后端代码来更新。
:::

## 6. vue中如何引入别的前端库(CDN)

当vue中需要使用别的库如echart或lodash等等，可以使用如下在vue中配置lib的方式来引入，参见节点范例的ecahrt图表节点

```vue
<template>
  <div style="height:200px;width:200px;" :id='id'></div>
</template>

<script>
  export default {
    props: ["inputs", "outputs", "serverStates"],
    emits: ["update:input"],
    data: () => {
      return {id: "echart图表" + Math.random()}
    },
    lib:[
      {name:'ecahrts',src:"https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js"},
      {name:'ecahrtsGl',src:"https://cdn.bootcdn.net/ajax/libs/echarts-gl/2.0.8/echarts-gl.min.js"},
    ]}
</script>
```