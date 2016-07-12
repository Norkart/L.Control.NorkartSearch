!function(e){function t(n){if(s[n])return s[n].exports;var r=s[n]={exports:{},id:n,loaded:!1};return e[n].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var s={};return t.m=e,t.c=s,t.p="",t(0)}([function(e,t,s){"use strict";var n=s(1),r=s(2),i=s(3);s(4);var o=s(8);n.Control.NorkartSearch=n.Control.extend({options:{position:"topright",placeholder:"Søk",showMarker:!0},onAdd:function(e){var t="leaflet-control-search",s=n.DomUtil.create("div",t),a=this.options;this.map=e,i.render(r.createElement(o,{NkAuth:a.NkAuth,apiKey:a.apiKey,placeholder:a.placeholder,hitSelected:this.hitSelected.bind(this)}),s);var h=n.DomEvent.stopPropagation,c=n.DomEvent._fakeStop||h;return n.DomEvent.on(s,"contextmenu",h).on(s,"click",c).on(s,"mousedown",h).on(s,"touchstart",h).on(s,"dblclick",c).on(s,"mousewheel",h).on(s,"MozMousePixelScroll",h),s},hitSelected:function(e){var t=n.latLng(e.PayLoad.Posisjon.Y,e.PayLoad.Posisjon.X);this.map.fire("search:select",{position:t,element:e}),this.options.showMarker&&(this.marker&&this.map.removeLayer(this.marker),this.marker=n.marker(t).addTo(this.map),this.map.setView(t,16))}}),n.control.norkartSearch=function(e){return new n.Control.NorkartSearch(e)}},function(e,t){e.exports=L},function(e,t){e.exports=React},function(e,t){e.exports=ReactDOM},function(e,t){},,,,function(e,t,s){"use strict";function n(e,t,s){t.getToken(function(n,r){var i={Authorization:"Bearer "+r,"X-WAAPI-Profile":t.config.profile};o(e,i,s)})}function r(e,t,s){var n={"X-WAAPI-Token":t};o(e,n,s)}var i=s(2),o=s(9),a=s(11),h=i.createClass({displayName:"HitElement",click:function(e){e.preventDefault(),this.props.hitSelected(this.props.hit.index)},render:function(){var e="list-group-item";return this.props.hit.hover&&!this.props.hit.selected&&(e+=" hover"),this.props.hit.selected&&(e+=" active"),i.createElement("a",{href:"#",className:e,onClick:this.click},this.props.hit.text)}}),c=i.createClass({displayName:"HitList",render:function(){if(!this.props.hits.length)return null;var e=this.props.hits.map(function(e,t){return{id:e.Id,text:e.Text,index:t,hover:t===this.props.hoverIndex,selected:t===this.props.selectedIndex}}.bind(this));return i.createElement("div",{className:"list-group result-list"},e.map(function(e){return i.createElement(h,{key:e.id,hit:e,hitSelected:this.props.hitSelected})}.bind(this)))}}),l=i.createClass({displayName:"SearchBox",getDefaultProps:function(){return{placeholder:"Søk"}},getInitialState:function(){return{text:"",hits:[],hoverIndex:null,selectedIndex:null}},onKeyDown:function(e){if(13===e.which||9===e.which){var t=this.state.hoverIndex;this.hitSelected(t)}else 40===e.which?this.changeHoverIndex(1):38===e.which&&this.changeHoverIndex(-1)},hitSelected:function(e){this.setState({selectedIndex:e});var t=this.state.hits[e];this.props.hitSelected&&this.props.hitSelected(t)},changeHoverIndex:function(e){var t=null!==this.state.hoverIndex?this.state.hoverIndex:-1,s=t+e;s>=this.state.hits.length?s=0:0>s&&(s=this.state.hits.length-1),this.setState({hoverIndex:s})},gotResults:function(e,t){this.setState({hits:t,hoverIndex:null,selectedIndex:null})},onChange:function(e){var t=e.target.value;if(this.setState({text:t}),this.props.apiKey)r(t,this.props.apiKey,this.gotResults);else{if(!this.props.NkAuth)throw new Error("Ikke tilgang!");n(t,this.props.NkAuth,this.gotResults)}},render:function(){return i.createElement("div",{className:"nk-search"},i.createElement("div",{className:"form-group has-feedback"},i.createElement("input",{onChange:this.onChange,onKeyDown:this.onKeyDown,type:"text",value:this.state.text,className:"form-control search",autoComplete:"off",placeholder:this.props.placeholder}),i.createElement("span",{className:"form-control-feedback"},i.createElement(a,null))),i.createElement(c,{hits:this.state.hits,selectedIndex:this.state.selectedIndex,hoverIndex:this.state.hoverIndex,hitSelected:this.hitSelected}))}});e.exports=l},function(e,t,s){"use strict";function n(e,t){for(var s in t)t.hasOwnProperty(s)&&(e[s]=t[s]);return e}function r(e,t,s){var r="//www.webatlas.no/WAAPI-FritekstSok/suggest/matrikkel/adresse?Query="+e,o=n({Accept:"application/json; charset=utf-8"},t);i({url:r,crossOrigin:!0,type:"json",method:"get",contentType:"application/json",headers:o,error:function(e){s(e)},success:function(e){s(null,e.Options)}})}var i=s(10);e.exports=r},function(e,t){e.exports=reqwest},function(e,t,s){"use strict";var n=s(2),r=n.createClass({displayName:"SearchIcon",render:function(){return n.createElement("svg",{version:"1.1",width:24,height:24,viewBox:"0 0 24 24",preserveAspectRatio:"xMidYMid meet"},n.createElement("g",{id:"Layer_1"},n.createElement("path",{style:{fill:"#51A026"},d:"M9,4c2.8,0,5,2.2,5,5s-2.2,5-5,5s-5-2.2-5-5S6.2,4,9,4 M9,2C5.1,2,2,5.1,2,9s3.1,7,7,7s7-3.1,7-7S12.9,2,9,2L9,2z"}),n.createElement("polygon",{style:{fill:"#000000"},points:"22,22 22,20 16,14 14,16 20,22"})))}});e.exports=r}]);