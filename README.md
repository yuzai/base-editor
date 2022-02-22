# monaco-base-ide

## 如何使用

### 安装

```
npm install yuzai-base-editor
```

### 使用

提供了两个IDE，Editor和MultiEditor.

Editor的作用主要是提供同时只需要单独编辑一个文件的场景。内部通过monaco-modal实现单monaco实例，多文件切换的行为，非常简单的包装。

MultiEditor提供了多文件目录导航的功能。

该组件由于内部状态较多，故不提供受控，仅通通过forwardRef进行各种命令的暴露。建议通过命令式的方法进行操作
