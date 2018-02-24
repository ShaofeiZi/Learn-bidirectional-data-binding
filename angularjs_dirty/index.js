/**
 * angularjs脏检查机制的实现
 */
window.onload = function () {
    'use strict';
    // 相当于$scope
    var scope = {
        increaseSprite: function () {
            this.sprite++;
        },
        decreaseSprite: function () {
            this.sprite--;
        },
        increaseCola: function () {
            this.cola++;
        },
        decreaseCola: function () {
            this.cola--;
        },
        cola: 0,
        sprite: 0
    };

    function Scope() {
        // AngularJS里，$$表示其为内部私有成员
        // $$watchlist里面保存需要绑定的数据列表
        this.$$watchList = [];
    }

    // 脏检查监测变化的一个方法
    Scope.prototype.$watch = function (name, getNewValue, listener) {
        var watch = {
            // 标明watch对象
            name: name,
            // 获取watch监测对象的值
            getNewValue: getNewValue,
            // 监听器，值发生改变时的操作
            listener: listener || function () {
            }
        };
        // 将需要监测变化的值放入列表
        this.$$watchList.push(watch);
    };

    Scope.prototype.$digest = function () {
        // 脏检查是否完成
        var dirty = true;
         // 执行次数限制
        var checkTime = 0;
        while (dirty) {
            dirty = false;
            var list = this.$$watchList;
            for (var i = 0, len = list.length; i < len; i++) {
                // 获取watch对应的对象
                var watch = list[i];
                console.log(watch);
                // 获取new和old的值
                var newValue = watch.getNewValue(watch.name);
                var oldValue = watch.last;
                // 进行脏检查
                if (newValue !== oldValue) {
                    watch.listener(newValue, oldValue);
                    dirty = true;
                } else {
                    scope[watch.name] = newValue;
                }
                watch.last = newValue;
            }
            checkTime++;
            if (checkTime > 10 && dirty) {
                throw new Error('检测超过了10次了');
            }
        }
    };

    var $scope = new Scope();
    $scope.$watch('sprite',
        function () {
            $scope.sprite = scope.sprite;
            return $scope[this.name];
        },
        function (newValue, oldValue) {
            console.log(newValue, oldValue)
        }
    );
    $scope.$watch('cola',
        function () {
            $scope.cola = scope.cola;
            return $scope[this.name];
        },
        function (newValue, oldValue) {
            console.log(newValue, oldValue)
        }
    );
    $scope.$watch('sum',
        function () {
            $scope.sum = scope.cola + scope.sprite;
            return $scope[this.name];
        },
        function (newValue, oldValue) {
            console.log(newValue, oldValue)
        }
    );

    /**
     * 便利ng-click并且绑定对应的方法名
     *
     */
    function bind() {

        var list = document.querySelectorAll('[ng-click]');
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].onclick = (function (index) {
                return function () {
                    var func = this.getAttribute('ng-click');
                    scope[func]();
                    apply();
                }
            })(i)
        }
    }

    /**
     * 做脏检查
     * 然后更新值
     *
     */
    function apply() {
        $scope.$digest();
        var list = document.querySelectorAll('[ng-bind]');
        for (var i = 0, len = list.length; i < len; i++) {
            var bindData = list[i].getAttribute('ng-bind');
            list[i].innerHTML = scope[bindData];
        }
    }

    bind();
    apply();
}