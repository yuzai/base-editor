# monaco-base-ide

## 如何使用

### 配置monaco打包

由于目前monaco-editor中存在一个还在修复中的bug，二次bundle后将存在esm conflict的问题。

故，本模块目前仅提供组件，将monaco-editor作为externals, 不处理monaco打包的问题。

使用者需要自行按照monaco-editor的[文档](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md)去配置打包。

### 安装

```
nenpm install @music/base-editor
```

### 使用

提供了两个IDE，Editor和MultiEditor.

Editor的作用主要是提供同时只需要单独编辑一个文件的场景。内部通过monaco-modal实现单monaco实例，多文件切换的行为。

使用方法可以参考[代码](https://g.hz.netease.com/cloudmusic-frontend/independent/monaco-editor-playground/-/blob/master/src/single/index.tsx);

组件参数定义如下：

```ts
React.FC<{
    value: string,
    language: string,
    onValueChange: (v: string) => void,
    options: monaco.editor.IStandaloneEditorConstructionOptions
}> 
```

MultiEditor提供了多文件目录导航的功能。

组件参数定义如下：

```ts
React.FC<{
    path: string,
    files: fileObj,
    value: string,
    onValueChange: (v: string) => void,
    onPathChange: (key: string, value: string) => void,
    options: monaco.editor.IStandaloneEditorConstructionOptions
}
```

### 说明

目前的版本比较匆忙，还是beta，使用上也都还**非常**粗糙

api还会不断修改完善

### cloudide开发

该项目已经在[cloudide平台](https://st.music.163.com/st/idestudio/)上运行，

我创建的一个实例在[这里](https://st.music.163.com/st/idestudio/openide?ideId=iaf7410d82e6b&projectName=monaco-editor-playground),

[demo](http://dev-iaf7410d82e6b-ide.igame.163.com/)可以在此处预览
