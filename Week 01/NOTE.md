# 学习笔记

## TicTacToe

- 规则
  - 棋盘：3*3方格
  - 双方分别持有圆圈和叉两种棋子
  - 双方交替落子
  - 率先连成三子直线的一方获胜

- 思路
  - 二位数组

  - 绘制棋盘格子
    > 换行思路<br>
    > 1. 直接创建br标签元素
    > 2. 给board div一个固定的宽度

  - 添加监听事件：分配角色表示人的对战和棋盘格状态交换律落子的运算结果
    > 空、圈、叉：空表示0、圈表示1⭕️、叉表示2❌  

  - 判断胜负，检查3行3列2斜

  - 电脑运算，增加willWin函数实现初步的AI功能

  - AI优化策略
    - 第一层策略：我要赢
    - 第二层策略：别输
    - 第三层策略：......
    - 棋谱
    - win lose 胜负剪枝：赢了就不再往下走了...

  - 人机对战
  
  - 思考问题
    - 如果用一维数组保存棋盘...
      > 使用乘法表示行列
    
    - 二维数组切换一维数组有什么好处？
      > 一旦他这个数组是一个一维数组，那么我们想要复制一个数组的话，我们就多了一种方法，我们的clone函数可以进行一次改造，利用JavaScript的原型机制，执行了一个object.create(pattern)，create出来根据JavaScript前面讲的语言相关的特点，这个clone只是创建了一个新对象并且以原有的pattern为原型，这个pattern不但继承了原来的pattern的方法同时继承了数据，所以完美的克隆了原来的pattern，因为新clone的pattern，它的生命周期要短于我们老的pattern，所以这个方法是可以代替我们原来JSON克隆的，节省很多的内存空间，里面的棋盘不需要再存一份。


- 小技巧
  - for循环使用let：词法作用域，i和j可以被保留下来；如果是var，move(j, i)就不能直接去用，得在addEventListener外面套一个ife
  - 从2变1，从1变2：给color设一个全部变量赋值1，用3减去color，最后3减1等于2，3减2 等于1，使用任何满足交换律的运算结果
  - 斜向使用{}：让win变成局部变量可以反复的声明和赋值，搭配let使用
  - 加label：如果要在两层循环里面，break掉两层循环，需要给外边加一个label
  - 一维数组的好处：节省内存空间

- 第一遍单独完成卡壳
  - 检查斜向右上的时候，把pattern[i][2 - i]写成pattern[i][i - 2]，导致找半天bug，可能没绕回来i+j=2的思维
  - willWin预检输赢
  - AI策略优化

- 第二遍理解了思维逻辑无卡壳

- 其他
  - AI实现需要靠估值的部分

## 红绿灯
  - 问题
    > 一个路口的红绿灯，会按照绿灯亮10秒，黄灯亮2秒，红灯亮5秒的顺序无限循环，请编写这个JS代码来控制这个红绿灯

  - 思路
    - JavaScript的异步机制
      - callback：利用函数回调
      - Promise：来自Promise/A+跨语言设计
      - async/await：基于Promise语法的支持和封装，运行时靠Promise去管理异步的机制

  - 实现
    - UI
    - 业务逻辑
  
  - 利弊
    - 经典回调：层级嵌套，callback-hell --> 回调地狱，降低代码阅读和运行效率
    - Promise：链式的表达式形式
    - async/await：分支、循环、顺序三种结构去描述异步关系，能够描述同步代码的分支顺序循环，也能够描述async/await的执行
      - 好处：添加事件
    - generator：yield模拟async/await

  - Promise
    - promise then 之后可以return 另一个 promise
    - 没有嵌套的关系，链式表达式的形式
    - Promise.all 同时等待多个Promise结束之后再去执行
    - Promise.race 进行竞争关系，多个Promise并行执行，回来一个Promise执行完毕

  - generator与异步
    - 模拟async/await
    - async generator：产出异步的迭代器 --> for await of语法相对应
    - async generator 和 for await of 配合使用机制

  - 注意
    - 在 **while true** ，里面没有break的用法，同步代码里面也基本不会出现，但是**在异步代码里很常见**
