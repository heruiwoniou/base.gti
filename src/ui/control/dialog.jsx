import Class from '../../core';
import {ElBase} from '../core/ElBase';
import {assign} from '../../util';
import { Promise } from '../core/promise';

export const Dialog = Class('ui.control.Modal', {
	base: ElBase,
	constructor(data = {}) {
		let private_data = {
			visible: false,
			controlButtons : [
				{ className: 'dialog-close', handle: this.close }
			]
		};
		let default_data = {
			/**
			 * 标题
			 */
			title: '未设置标题',
			/**
			 * content 与 src　有且只能一个，content优先级高于src
			 */
			content: '',
			/**
			 * iframe地址或者 ajax请求地址
			 */
			src: 'about:blank',
			/**
			 * 是否为部分页面加载
			 * true : ajax模式部分页面加载
			 * false : iframe方式加载页面
			 */
			ajax: false,
			/**
			 * 宽度设置
			 */
			width: 800,
			/**
			 * 高度设置
			 */
			height: 200,
			/**
			 * 头高度
			 */
			titleHeight: 40,

		}
		this.callParent(assign(default_data, data, private_data));
	},
	render(h, data) {
		var props = data.visible ? { style : 'height: 100%;'} : null;
		return (
			<div uid={ this.uid.toString() } { ...props }>
			{ data.visible ? this.template.call(this, h, this.data, this) : null }
			</div>
		)
	},
	template(h, data) {

		var headRange = {
			style: {
				height: data.titleHeight,
				lineHeight: data.titleHeight + 'px'
			}
		}
		var titleRange = {
			style: {
				height: data.titleHeight,
				right: data.controlButtons.length * data.titleHeight 
			}
		}
		var controlRange = {
			style: {
				height: data.titleHeight,
				lineHeight: data.titleHeight + 'px'
			}
		}
		var controlButtonRange = {
			style:{
				height: data.titleHeight,
				width: data.titleHeight
			}
		}
		var bodyRang = {
			style: {
				minHeight: data.height - data.titleHeight,
				minWidth: data.width
			}
		}
		return (
			<div className="dialog-container">
				<span></span>
				<div className="dialog">
					<div className="dialog-head" { ...headRange } >
						<div className="dialog-title" { ...titleRange }>{ data.title }</div>
						<div className="dialog-control" { ...controlRange }>
							{ 
								this.data.controlButtons.map( 
									button => <a className={ button.className } href="javascript:;" onclick={ button.handle.bind(this) } { ...controlButtonRange }>x</a>
								) 
							}
						</div>
					</div>
					<div className="dialog-body" { ...bodyRang}>
						<p>{1}</p>
						<p>{2}</p>
						<p>{3}</p>
						<p>{4}</p>
					</div>
				</div>
			</div>
		);
	},
	show(){
		this.data.visible = true;
		this.update();
		var promise = new Promise(this);
		promise.resolve('show');
		return this;
	},
	close(){
		this.data.visible = false;
		this.update();
		return this;
	}
})