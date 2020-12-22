# 学习笔记

## proxy 与双向绑定

    设计：强大且危险的。
    代码：预期性回变差。
    特性：专门用底层库。

  * ### proxy 基本用法
    - 创建 object
    
      > 由于写死，不可 observe 的对象，单纯的数据存储。
    * 既设置还被监听

      > 通过 proxy 把 object 做一层包裹。
    - 创建 proxy

      > 通过钩子函数和 JavaScript 内置对象可以拦截它并且改变它的行为。
      >
      > proxy 对象也是一个非常强大的对象。
      >
      > 可以通过 proxy 的 config 改变行为。

  - ### 模仿 reactive 实现原理(一)

        实现 Vue3.0 的 reactive 模型，写一个玩具版本的 reactive，学习 proxy 有哪些强大的用途。

    * 将对象做一些简单的包装且实现其原理。
    
      > 在 Vue3.0 里面，把 Vue 原来的能力拆了一下包产生一个叫 reactive 包，Vue3.0 的特性。

    - 加属性让其实现真正的 reactive 的特性，拥有事件监听。

      > 使用 Vue API effect 去做监听。

    * 仅传一个函数，让它能只有在对应的变量去变化的时候能够触发函数的调用。
    
      > 给 reactive 和 effect 之间建立连接。

    - 优化 reactive ，让 effect 里面的 po.a.b 也能够被监听到。

    * 利用 reactivity 监听，实现双向绑定。
      
      > 调色盘的例子：MVVM 模式的经典案例。


  * 使用 Range 和 CSSOM 做一个简单的拖拽。

    > 允许一个东西参与到排版当中，拖拽的过程中改变排版位置。

    - 在 document 上使用 mousedown、mouseup、mousemove 监听事件整出 dragdrop 的基础和基本功能。

          拖拽的骨架代码：
          <pre>
            <div id="dragable" style="width: 100px; height: 100px; background-color: pink;"></div>
            <script>
              let dragable = document.getElementById("dragable");
              dragable.addEventListener("mousedown", function (event) {
                // 在 mouseup 的时候要把 mousemove 和 mouseup 再给它 removeEventListener 去掉，即需要两个变量保存起来。
                let up = () => {
                  document.removeEventListener("mousemove", move);
                  document.removeEventListener("mouseup", up);
                }
                let move = event => {
                  console.log("move:", event);
                }
                // 在 document 上去监听 mousemove 和 mouseup
                document.addEventListener("mousemove", move);
                document.addEventListener("mouseup", up);
              });
            </script>
          </pre>

    * 把普通的拖拽变成一个可以在正常流里面进行拖拽。

    
