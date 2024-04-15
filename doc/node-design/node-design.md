# 节点开发

## 节点的设计流程

1. 新建节点
2. 配置节点输入、输出参数
3. 编写节点js或python函数(可选)
4. 编写节点vue代码(可选)

节点的输入参数对应着节点的输入端口，节点的输出参数则对应节点的输出端口
节点执行阶段会优先调用vue代码内的methods内的func函数，若不存在func函数，则会调用**函数编写**面板的js或python函数来执行。
<div style="justify-content:center;display:flex;">
    <img src="/node-design/node-design/node_run_flow.png"  >
</div>

::: tip
此处说明的都是前端、客户端编辑设计的节点，若是使用pyfineflow的后端节点，则无需编写func函数，它会默认使用pyfineflow的node装饰的函数。
pyfineflow的后端节点节点设计请参考后续章节。
:::

节点编辑面板介绍：
![node_editor](/node-design/node-design/node_editor.png)

## 参数设置

<div style="justify-content:center;display:flex;">
    <img src="/node-design/node-design/node_params.png" width="500" >
</div>

在节点编辑面板左侧参数配置面板，可以添加配置指定类型的节点参数。
参数配置项包括：
| 配置项 | 说明 |
| ------ | ---------------------------------------------------- |
| 键值 | 参数在函数中的变量名,不能重复,需符合变量名命名规范 |
| 名称 | 参数名称 |
| 类型 | 参数类型 |
| 描述 | 参数的描述信息 |

其中参数类型包括基本数据类型，如

| 数据类型     | 说明                                                       |
|----------|----------------------------------------------------------|
| 字符串      | string                                                   |
| 整数       | integer                                                  |
| 浮点数      | float                                                    |
| 枚举       | enum                                                     |
| any类型    | 该类型可以连接任意类型的参数                                           |
| custom类型 | custom类型为自定义类型，用户可以自定义类型名称，若输入输出参数的custom定义的类型名称相同则可以连接。 |

## 编写节点函数

在节点编辑面板的函数编辑面板可编辑节点函数
<div style="justify-content:center;display:flex;">
    <img src="/node-design/node-design/func_editor.png" width="500" >
</div>

函数的输入参数params,其值为输入参数键值和值组成的字典,例如:

```json
{
  "paramKey1": "str1",
  "paramKey2": "str2"
}
```

函数的返回值也应为输出参数值字典:

```json
{
  "returnKey1": "str1",
  "returnKey2": "str2"
}
```

::: tip
输出参数若某一个值为undefined,那么它不会进行该参数所连接的后续输入进行触发。

同样的返回参数字典若不存在某一个键值，那么它也不会对该参数所连接的后续输入进行触发
:::

## 使用vue设计节点

使用vue编辑节点代码和编写vue组件类似，可以直接使用但有一些限制。

**节点的vue说明:**

1. 预置了elementplus组件库，可以直接使用
2. vue代码只能使用选项式语法编写
3. 分别只能有一个template块、script块、style块
4. 不能使用import

### 代码示例

```vue

<template>
  <div>
    <img v-if="inputs.url" :src="inputs.url">
    <el-button size="small">按钮</el-button>
  </div>
</template>

<script>
  export default {
    props: ["inputs", "outputs", "userInputs", "serverStates"],
    emits: ["update:input"],
    data() {
      return {msg: 'hello'}
    },
    mounted() {
    },
    methods: {
      // func(params){
      //     return params
      // }
    }
  }

</script>

<style>
  .class-name {
    color: white;
  }
</style>
```

代码中props、emits、还有methods中有一些预置的定义，具体含义如下表所示：

| 配置项                 | 描述                                                    |
|---------------------|-------------------------------------------------------|
| props->inputs       | 节点综合输入参数字典(只读)                                        |
| props->outputs      | 节点综合输出参数字典(只读)                                        |
| props->userInputs   | 节点用户手动输入参数字典(只读)                                      |
| props->serverStates | 后端传递的状态信息(只读)                                         |
| emits->update:input | 更新用户输入参数的事件,使用方法:this.$emit('update:input',key,value) |
| methods->func       | 若该方法存在则节点执行时会优先执行该函数，编写方法和节点js函数一样，可使用async           |

## 节点编辑示例

<div style="justify-content:center;display:flex;">
    <img src="/node-design/node-design/node_edit_des.png" style="width: 100%" >
</div>

代码:

```vue

<template>
  <div class='mb-1 text'>vue界面:</div>
  <div class='mb-1 mt-4 text'>1.预置element-plus组件:</div>
  <div class='mb-1'>
    <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="50"
        status="exception"
    />
  </div>
  <div class='mt-4 text'>2.节点的输入输出引用:</div>
  <div class='mb-1'>props.inputs:{{inputs}}</div>
  <div class='mb-1'>props.outputs:{{outputs}}</div>
  <div class="mt-4 mb-1 text">
    3.使用emit("update:input",key,value)从vue更新输入：
  </div>
  <el-button size=small type=primary @click=updateInput>更新num1为9</el-button>
  <div class="mt-4 text">4.在methods.func中编写节点执行方法</div>
  <div>节点执行信息：{{msg}}</div>
</template>

<script>
  export default {
    props: ["inputs", "outputs", "serverStates"],
    emits: ["update:input"],
    data: () => {
      return {msg: ""}
    },
    methods: {
      updateInput() {
        this.$emit("update:input", "num1", 9)
      },
      func(params) {
        this.msg = 'methods.func执行完成'
        return {value: params.num1 + params.num2}
      }
    }
  }
</script>

<style>
  .text {
    font-weight: bold;
  }
</style>

```

## 客户端和web端节点的区别(新增)

客户端使用tauri构建，它在window.__TAURI__上挂载了许多的功能，包括本地文件访问等，具体使用方式需要查看tauri官方文档。
而web端的节点是使用不了该能力的，可以考虑使用内置python接口封装来替代tauri的功能。