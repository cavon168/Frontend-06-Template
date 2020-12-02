# 学习笔记

## 使用 LL 算法构建 AST

- ### AST：抽象语法树
> 在算计中(语法分析)构建过程：
> 1. 把编程语言去分词
>
> 2. 把词构成层层相嵌套的语法树的树形结构
>
> 3. 解析代码去执行

- ### 语法分析核心思想：
> 1. LL 算法 ( Left Left )
>
>     - 从左到右扫描
>
>     * 从左到右规约
>
> 2. LR 算法

- ### 四则运算

  * 四则运算词法定义：

    > - TokenNumber：. 1 2 3 4 5 6 7 8 9 0 的组合
    > * Operator： +、 - 、 * 、 / 之一 
    > - Whitespace：`<SP>`
    > * LineTerminator：`<LF> <CR>`

  - 四则运算语法定义：

    <html>
      <body>

    ```     
      <Expression>::=
        <AdditiveExpression><EOF>

      <AdditiveExpression>::=
        <MultiplicativeExpression>
        |<AdditiveExpression><+><MultiplicativeExpression>
        |<AdditiveExpression><-><MultiplicativeExpression>
    
      <MultiplicativeExpression>::=
        <Number>
        |<MultiplicativeExpression><*><Number>
        |<MultiplicativeExpression></><Number>
    ```

      </body>
    <html>
    
    >
    >
    > 1. JavaScript 部分产生式定义 + / * 法运算
    > 2. 加法是由左右两个乘法组成，由于可以连加也是一个重复自身的序列，会有递归的产生式结构
    > 3. `<EOF>、<+>、<->、<Number>、<*><Number>、</><Number>` 定义里面的终结符 —— TerminalSymbol：直接从词法里面扫描出来
    > 4. 其他部分为 NoneTerminalSymbol 非终结符：拿终结符的组合定义出来的 
    > 5. EOF：特殊的符号，不是一个真实可见的字符，由于语法需要一个终结，有些程序代码到尾巴上才能结束，而 EOF 就是这样一个符号，标识了所有源代码的结束。—— End of File
  
- ### LL语法分析 - 四则产生式
  
  + 加法

    <html>
      <body>

    ```
      <AdditiveExpression>::=
        <MultiplicativeExpression>
        |<AdditiveExpression><+><MultiplicativeExpression>
        |<AdditiveExpression><-><MultiplicativeExpression>
    ```

      </body>
    <html>

    比如：策划分析处理 AdditiveExpression 找到的第一个 symbol 会是什么？
    
      > 1. 开头是一个 MultiplicativeExpression 
      > 
      > 2. 开头是一个 AdditiveExpression 
  + 乘法

    <html>
      <body>

    ```      
      <AdditiveExpression>::=
        <Number>
        |<MultiplicativeExpression><*><Number>
        |<MultiplicativeExpression></><Number>
        |<AdditiveExpression><+><MultiplicativeExpression>
        |<AdditiveExpression><-><MultiplicativeExpression>
    ```

    </body>
  <html>
    
