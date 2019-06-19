"user strict";
/**
 * @author yinhutjfox 493386452@qq.com
 */
(function(global)
{
	let nameKey = 'name';
	let childrenKey = 'children';
	let actionKey = 'action';
	let makeTree = function(dom , data)
	{
		for(let i = 0 ; i < data.length ; ++i)
		{
			let treeNode = document.createElement("div");
			treeNode.setAttribute("class" , "treeNode");
			let nameNode = document.createElement("div");
			nameNode.textContent = data[i][nameKey];
			nameNode.setAttribute("class" , "treeNodeName");
			if(data[i][actionKey])
			{
				for(let j = 0 ; j < data[i][actionKey].length ; ++j)
				{
					for(let key in data[i][actionKey][j])
					{
						nameNode.addEventListener(key , function() {
							let temp = {
								dom : nameNode ,
								data : data[i]
							};
							data[i][actionKey][j][key].apply(temp);
						});
					}
				}
			}
			let contentNode = document.createElement("div");
			contentNode.setAttribute("class" , "treeNodeContentHidden");
			contentNode.style.height = "0px";
			if(data[i][childrenKey])
			{
				if(0 != data[i][childrenKey].length)
				{
					makeTree(contentNode , data[i][childrenKey]);
				}
			}
			treeNode.appendChild(nameNode);
			treeNode.appendChild(contentNode);
			dom.appendChild(treeNode);
		}
	};

	let bindEvent = function(dom)
	{
		let childrenNodes = dom.children;
		for(let i = 0 ; i < childrenNodes.length ; ++i)
		{
			if("treeNode" == childrenNodes[i].getAttribute("class"))
			{
				let nameNode = childrenNodes[i].children[0];
				let contentNode = childrenNodes[i].children[1];
				nameNode.addEventListener("click" , function(){
					let self = this;
					if("treeNodeContentHidden" == contentNode.getAttribute("class"))
					{
						if(self.hiddenInterval)
						{
							if(null != self.hiddenInterval)
							{
								clearInterval(self.hiddenInterval);
							}
						}
						self.displayInterval = setInterval(function(){
							let totalHeight = 0;
							for(let j = 0 ; j < contentNode.children.length ; ++j)
							{
								totalHeight += contentNode.children[j].clientHeight;
							}
							if(totalHeight > contentNode.clientHeight)
							{
								contentNode.style.height = (contentNode.clientHeight + 1) + "px";
							}
							else
							{
								contentNode.style.height = "";
								clearInterval(self.displayInterval);
							}
						} , 4);
						contentNode.setAttribute("class" , "treeNodeContentDisplay");
					}
					else
					{
						if(self.displayInterval)
						{
							if(null != self.displayInterval)
							{
								clearInterval(self.displayInterval);
							}
						}
						self.hiddenInterval = setInterval(function(){
							if(0 < contentNode.clientHeight)
							{
								contentNode.style.height = (contentNode.clientHeight - 1) + "px";
							}
							else
							{
								contentNode.style.height = "0px";
								clearInterval(self.hiddenInterval);
							}
						} , 4);
						contentNode.setAttribute("class" , "treeNodeContentHidden");
					}
				});
				bindEvent(contentNode);
			}
		}
	};

	function DirectoryTree()
	{

	}

	DirectoryTree.prototype.createTree = function(dom , data)
	{
		if(dom.getAttribute('nameKey')) {
			nameKey = dom.getAttribute('nameKey')
		}
		if(dom.getAttribute('childrenKey')) {
			childrenKey = dom.getAttribute('childrenKey')
		}
		if(dom.getAttribute('actionKey')) {
			actionKey = dom.getAttribute('actionKey')
		}
		dom.style.marginLeft = "-20px";
		dom.style.position = "relative";
		makeTree(dom , data);
		bindEvent(dom);
	};

	global.DirectoryTree = new DirectoryTree();
})(window);