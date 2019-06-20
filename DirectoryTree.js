"user strict";
/**
 * @author yinhutjfox 493386452@qq.com
 */
(function (global) {
    let nameKey = 'name';
    let childrenKey = 'children';
    let actionKey = 'action';
    let speed = 125;
    let defaultClickFunc;
    let styleDom;
    let indent = '23px';
    let nodeHoverStyle = '';
    let customNodeStyle = '';
    let bindFlag = false;

    let getNodeName = function (nodeData, nameKeyStr) {
        let nameTemp = nameKeyStr.split('.');
        let dataTemp = nodeData;
        nameTemp.forEach(name => {
            dataTemp = dataTemp[name]
        });
        return dataTemp
    };

    let resetDataName = function (nodeData, nameKeyStr , newName) {
        let nameTemp = nameKeyStr.split('.');
        let dataTemp = nodeData;
        for(let i = 0 ; i < nameTemp.length - 1 ; ++i) {
            dataTemp = dataTemp[nameTemp[i]]
        }
        dataTemp[nameTemp[nameTemp.length - 1]] = newName;
    };

    let initStyle = function () {
        if (document.head.querySelector('style')) {
            styleDom = document.head.querySelector('style');
        } else {
            styleDom = document.createElement('style');
            document.head.appendChild(styleDom);
        }
        styleDom.textContent += '        .treeNode\n        {\n            position : relative ;\n            margin-left : ' + indent + ' ;\n        }\n   .treeNodeContentDisplay\n        {\n            position : relative ;\n            overflow : hidden\n        }\n        .treeNodeContentHidden\n        {\n            position : relative ;\n            overflow : hidden\n        }\n'
        styleDom.textContent += '        .containerNode:hover\n' +
            '        {\n' +
            nodeHoverStyle +
            '        }';
        styleDom.textContent += '        .customNode\n' +
            '        {\n' +
            customNodeStyle +
            '        }'
    };

    let makeTree = function (dom, data) {
        for (let i = 0; i < data.length; ++i) {
            let treeNode = document.createElement("div");
            let containerNode = document.createElement("div");
            let hasClick = false;
            let bindObj = {
                dom: containerNode,
                data: data[i] ,
                setName : function(name) {
                    if(bindFlag) {
                        resetDataName(data[i], nameKey , name);
                    }
                    containerNode.textContent = name;
                }
            };
            treeNode.setAttribute("class", "treeNode customNode");
            containerNode.textContent = getNodeName(data[i], nameKey);
            containerNode.setAttribute("class", "containerNode");
            if (data[i][actionKey]) {
                for (let key in data[i][actionKey]) {
                    if('click' === key) {
                        hasClick = true;
                    }
                    containerNode.addEventListener(key, function () {
                        data[i][actionKey][key].apply(bindObj);
                    });
                }
            }
            if(!hasClick) {
                if (defaultClickFunc) {
                    containerNode.addEventListener('click', function () {
                        defaultClickFunc.apply(bindObj);
                    });
                }
            }
            let contentNode = document.createElement("div");
            contentNode.setAttribute("class", "treeNodeContentHidden");
            contentNode.style.height = "0px";
            if (data[i][childrenKey]) {
                if (0 !== data[i][childrenKey].length) {
                    makeTree(contentNode, data[i][childrenKey]);
                }
            }
            treeNode.appendChild(containerNode);
            treeNode.appendChild(contentNode);
            dom.appendChild(treeNode);
        }
    };

    let bindEvent = function (dom) {
        let childrenNodes = dom.children;
        for (let i = 0; i < childrenNodes.length; ++i) {
            if (-1 !== childrenNodes[i].getAttribute("class").indexOf('treeNode')) {
                let containerNode = childrenNodes[i].children[0];
                let contentNode = childrenNodes[i].children[1];
                containerNode.addEventListener("click", function () {
                    let self = this;
                    if (-1 !== contentNode.getAttribute("class").indexOf('treeNodeContentHidden')) {
                        if (self.hiddenInterval) {
                            if (null != self.hiddenInterval) {
                                clearInterval(self.hiddenInterval);
                            }
                        }
                        self.displayInterval = setInterval(function () {
                            let totalHeight = 0;
                            let diff = 2;
                            for (let j = 0; j < contentNode.children.length; ++j) {
                                totalHeight += contentNode.children[j].clientHeight;
                            }
                            diff = 0 === Math.floor(totalHeight / speed) ? 2 : Math.floor(totalHeight / speed);
                            if (totalHeight > contentNode.clientHeight) {
                                contentNode.style.height = (contentNode.clientHeight + diff) + "px";
                            } else {
                                contentNode.style.height = "";
                                clearInterval(self.displayInterval);
                            }
                        }, 4);
                        contentNode.setAttribute("class", "treeNodeContentDisplay");
                    } else {
                        if (self.displayInterval) {
                            if (null != self.displayInterval) {
                                clearInterval(self.displayInterval);
                            }
                        }
                        self.hiddenInterval = setInterval(function () {
                            let totalHeight = 0;
                            let diff = 2;
                            for (let j = 0; j < contentNode.children.length; ++j) {
                                totalHeight += contentNode.children[j].clientHeight;
                            }
                            diff = 0 === Math.floor(totalHeight / speed) ? 2 : Math.floor(totalHeight / speed);
                            if (0 < contentNode.clientHeight) {
                                contentNode.style.height = (contentNode.clientHeight - diff) + "px";
                            } else {
                                contentNode.style.height = "0px";
                                clearInterval(self.hiddenInterval);
                            }
                        }, 4);
                        contentNode.setAttribute("class", "treeNodeContentHidden");
                    }
                });
                bindEvent(contentNode);
            }
        }
    };

    function DirectoryTree() {

    }

    DirectoryTree.prototype.createTree = function (prop) {
        let dom;
        let data;
        if (!prop['el']) {
            throw new Error('el must be defined');
        }
        dom = document.querySelector(prop['el']);
        if (!prop['data']) {
            throw new Error('data must be defined');
        }
        data = prop['data'];
        defaultClickFunc = prop['defaultClick'];
        if (dom.getAttribute('nameKey')) {
            nameKey = dom.getAttribute('nameKey');
        }
        if (dom.getAttribute('childrenKey')) {
            childrenKey = dom.getAttribute('childrenKey');
        }
        if (dom.getAttribute('actionKey')) {
            actionKey = dom.getAttribute('actionKey');
        }
        if (dom.getAttribute('indent')) {
            indent = dom.getAttribute('indent');
        }
        if(prop['nodeHoverStyle']) {
            for(let key in prop['nodeHoverStyle']) {
                nodeHoverStyle += '            ' + key + ': ' + prop['nodeHoverStyle'][key] + ';\n'
            }
        }
        if(prop['customNodeStyle']) {
            for(let key in prop['customNodeStyle']) {
                customNodeStyle += '            ' + key + ': ' + prop['customNodeStyle'][key] + ';\n'
            }
        }
        if(prop['bindFlag']) {
            if(prop['bindFlag'] instanceof Boolean) {
               bindFlag = prop['bindFlag'];
            } else {
                throw new Error('bindFlag must be Boolean');
            }
        }
        dom.style.marginLeft = "-20px";
        dom.style.position = "relative";
        initStyle();
        makeTree(dom, data);
        bindEvent(dom);
    };

    global.DirectoryTree = new DirectoryTree();
})(window);