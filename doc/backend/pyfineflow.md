# 介绍

pyfineflow是一个让**后端python函数**变成**fineflow节点**的库，通过简单的配置，即可让你的python项目内的函数变成fineflow可用的流程节点。

## 使用方式

### 安装

```shell
pip install pyfineflow
```

### 使用示例

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
docs:  http://127.0.0.1:8081/pyserver/docs
2024-01-27  12:55:08 INFO:     Started server process [26540]
2024-01-27  12:55:08 INFO:     Waiting for application startup.
2024-01-27  12:55:08 INFO:     Application startup complete.
2024-01-27  12:55:08 INFO:     Uvicorn running on http://127.0.0.1:8081
```

然后在fineflow界面添加server

点击左下角**服务管理**，然后在**节点服务**点击**添加**按钮，输入server地址：

![add_server](/backend/pyfineflow/add_server.png)

添加完成后，在服务管理启用对应的server，在节点列表即可看到新添加的节点
![enable_server](/backend/pyfineflow/enable_server.png)

如图为新添加的后端节点
<div style="justify-content:center;display:flex;">
    <img src="/backend/pyfineflow/new_nodes.png" width="500" >
</div>