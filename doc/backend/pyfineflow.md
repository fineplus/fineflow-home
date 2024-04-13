# 介绍

pyfineflow是一个让**后端python函数**变成**fineflow节点**的库，通过简单的配置，即可让你的python项目内的函数变成fineflow可用的流程节点。

## 基本使用方式

### 1.安装

```shell
pip install pyfineflow
```

### 2.使用示例

首先创建一个python项目demo：

- pyfineflow-demo/
  - main.py
  - app.py
  - math_nodes.py

```python
# app.py
from pyfineflow.core import Fine
fine = Fine('pyserver', 'python后端')
```

```python
# math_nodes.py
import time
from datetime import datetime
from pathlib import Path
from pyfineflow.core import get_ctx
from app import fine


@fine.node(category='数学运算', name="相加")
def add(num1: int, num2: int) -> int:
    num = num2 + num1
    return num


@fine.node(category='数学运算', name="相减")
def sub(num1: int, num2: int = 2) -> int:
    num = num1 - num2
    return num
    
@fine.node(category='数学运算')
def 原样返回(num1: int, num2: int = 2) -> (int,int):
    return num1,num2
```

```python
# main.py
from app import fine


def init():
    import math_nodes
    _ = math_nodes


init()
fine.init_server(port=8081)

```

运行

```shell
python main.py
```

输出如下

```shell
docs:  http://127.0.0.1:8081/python后端/docs
server url:  http://127.0.0.1:8081/python后端
server key:  python后端
2024-04-07  19:16:54 INFO:     Started server process [3040]
2024-04-07  19:16:54 INFO:     Waiting for application startup.
2024-04-07  19:16:54 INFO:     Application startup complete.
2024-04-07  19:16:54 INFO:     Uvicorn running on http://127.0.0.1:8081 (Press CTRL+C to quit)
```
其中**server url**为服务的链接，
 **server key**为服务的key

然后在fineflow界面添加server

点击左下角**服务管理**，然后在**节点服务**点击**添加**按钮，配置服务信息：

| 配置项 | 说明                  |
|-----|---------------------|
| 索引  | 服务的server key       |
| 名称  | 可以自定义               |
| 链接  | 服务的链接，上述的server url |


![add_server](/backend/pyfineflow/add_server.png)

添加完成后，在服务管理启用对应的server，在节点列表即可看到新添加的节点
![enable_server](/backend/pyfineflow/enable_server.png)

如图为新添加的后端节点,它的名称为app.py里Fine的第一个参数
```python
fine = Fine('pyserver', 'python后端')
```

<div style="justify-content:center;display:flex;">
    <img src="/backend/pyfineflow/new_nodes.png" width="300" >
</div>

## 后端节点详细设计

后端节点编写时需要注意:
1. 需要配置参数类型，若不配置则默认为any类型。
2. 函数有多个返回参数时，返回值是字典，{"key1":value,"key2":value},和前端编写节点是一样的，然后在config里配置输入输出参数的信息，不配置的话会默认取参数的键值。

```python
# 很多参数都不用配置，不配置会有默认配置，有多个返回值时使用字典来返回，并且不用配置函数的返回参数类型。
@fine.node(category='数学运算', name="返回多个值",
           config={'input': [{"key": "num1", "config": {"type": "integer"}}, {"key": "num2"}],
                   'output': [{"key": "num",  "config": {"type": "integer"}},
                              {"key": "num1", "name": "num1", "config": {"type": "integer"}},
                              {"key": "num2", "name": "num2", "config": {"type": "integer"}}]
                   })
def add(num1: int, num2: int):
    num = num2 + num1
    return {"num": num, "num1": num1, "num2": num2}
```

::: tip
input和output的每一项里面还有个useServer参数，由于有些输出值是无法序列化、或不需要传输到前端只是在后端传递的，则设置useServer为true，不配置的话程序则自动按情况配置该参数是true还是false。
useServer为true的参数它在前端传递的值是它的id而不是它本身，在后端传递的则是它的实例了，并且不同后端之间是不能传递这种值的，毕竟无法序列化，又不在用一个内存里
:::

3. 当return参数只有一个的时候，若想方便一点的话(或直接使用2的方式写成一个字典，虽然只有一个参数)，就需要配置函数返回类型，并只能使用"return 返回参数"的形式，不能"return 表达式"，然后不进行其它配置时，如下所示，它默认返回是 {'num':值}

> 当只有一个返回参数时，可以使用如下方式
```python

@fine.node(category='数学运算', name="相减")
def sub(num1: int, num2: int = 2) -> int:
    num = num1 - num2
    
    return num # 正确

    return num+1 # 错误,不能这样 
```
## 配置后端节点vue、样式
后端节点也是可以在后端配置样式、编写vue代码的。
在node的vue参数配置vue代码文件路径，config则是节点的各种信息、样式参数配置
代码如下:
```python
# math_nodes.py
from app import fine

@fine.node(category='数学运算', name="相减", vue='./相减.vue', config={'ui': {'width': 200}})
def sub(num1: int, num2: int = 2) -> int:
    num = num1 - num2
    return num
```

```vue
<template>
你好
</template>
```

## 前后端socket通信
有时候后端节点需要与前端进行一个实时通信，则可以使用get_ctx方法获取节点实例，使用如下方法进行前后端通信
后端使用ctx.update_state来更新状态，前端vue使用serverStates.value来获取状态
```python
from datetime import datetime
from app import fine
from pyfineflow.core import get_ctx
import time

@fine.node(category='数学运算', vue="demo.vue", config={"ui": {"width": 170}})
def 前后端socket通信节点(等待秒数: int = 8) -> int:
    ctx = get_ctx(前后端socket通信节点)
    for i in range(等待秒数):
        time.sleep(1)
        current_time = datetime.now()
        # 格式化输出当前时间（按照特定格式）
        formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S")
        ctx.update_state('time', formatted_time)
    return 等待秒数
```

前后端socket通信节点.vue
```vue
<template>
    <div>时间：{{ serverStates.value.time }}</div>
</template>

<script>
export default {
    props: ["inputs", "outputs", "serverStates"],
    emits: ["update:input"],
    data: () => {
        return { msg: "hello" }
    }
}
</script>

<style></style>
```