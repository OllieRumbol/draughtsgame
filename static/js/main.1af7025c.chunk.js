(this.webpackJsonpdraughtsgame=this.webpackJsonpdraughtsgame||[]).push([[0],{33:function(e,t,n){},56:function(e,t,n){},57:function(e,t,n){},61:function(e,t,n){},62:function(e,t,n){},63:function(e,t,n){},64:function(e,t,n){},68:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n(1),c=n.n(i),r=n(25),s=n.n(r),l=(n(56),n(6)),o=n(13),h=n(14),u=n(22);n(23);function d(e){return Object(a.jsx)("div",{children:Object(a.jsxs)(u.a,{children:[Object(a.jsx)(u.a.Header,{children:Object(a.jsx)("h2",{children:e.title})}),Object(a.jsx)(u.a.Body,{children:e.innerComponent})]})})}var j=n(40);n(33);function b(e){var t=function(){var e=Object(i.useRef)(null),t=Object(i.useState)(!1),n=Object(l.a)(t,2),a=n[0],c=n[1];function r(t){e.current&&e.current.contains(t.target)?c(!0):c(!1)}return Object(i.useEffect)((function(){return document.addEventListener("mousedown",r,!0),function(){document.removeEventListener("mousedown",r,!0)}}),[e]),{visible:a,ref:e}}(),n=t.visible,c=t.ref,r=n?"circle red center yellow":"circle red center",s=n?"circle blue center yellow":"circle blue center",o=e.state,h=e.y,u=e.x,d=e.setCounterToMove,j=function(){d({state:o,height:h,width:u})};return 1===e.state?Object(a.jsx)("div",{ref:c,className:r,onClick:j}):2===e.state?Object(a.jsx)("div",{ref:c,className:s,onClick:j}):3===e.state?Object(a.jsx)("div",{ref:c,className:r,onClick:j,children:"K"}):4===e.state?Object(a.jsx)("div",{ref:c,className:s,onClick:j,children:"K"}):Object(a.jsx)("div",{})}n(57);function f(e){var t=e.state,n=6===t?"square tip":0!==t?"square black":"square",i=e.y,c=e.x,r=e.setSquareToMoveTo;return Object(a.jsx)("div",{className:n,onClick:function(){5!==t&&6!==t||r({height:i,width:c})},children:Object(a.jsx)(b,{state:t,y:i,x:c,setCounterToMove:e.setCounterToMove})})}var g=n(12),p=n(8);function O(e){var t=function(){return e.update(!1)};return Object(a.jsx)("div",{children:Object(a.jsxs)(g.a,{show:e.show,onHide:t,backdrop:"static",children:[Object(a.jsx)(g.a.Header,{closeButton:!0,children:Object(a.jsx)(g.a.Title,{children:"Would you like to take again?"})}),Object(a.jsx)(g.a.Body,{children:"In draughts players can jump multiple times to take multiple pieces from their opponent."}),Object(a.jsxs)(g.a.Footer,{children:[Object(a.jsx)(p.a,{variant:"primary",onClick:function(){e.setJumpModalValue(!0),t()},children:"Yes"}),Object(a.jsx)(p.a,{variant:"primary",onClick:function(){e.setJumpModalValue(!1),t()},children:"No"})]})]})})}function x(e){var t=function(){return e.update(!1)};return Object(a.jsx)("div",{children:Object(a.jsxs)(g.a,{show:e.show,onHide:t,backdrop:"static",children:[Object(a.jsx)(g.a.Header,{closeButton:!0,children:Object(a.jsx)(g.a.Title,{children:"That was an invalid move"})}),Object(a.jsx)(g.a.Body,{children:"Please pick another move to continue the game."}),Object(a.jsx)(g.a.Footer,{children:Object(a.jsx)(p.a,{variant:"primary",onClick:t,children:"Okay"})})]})})}var m=n(27),w=n(17),v=(n(61),n(38)),y=n(39),k=function(){function e(t){Object(v.a)(this,e),this.Value=t,this.Left=null,this.Right=null}return Object(y.a)(e,null,[{key:"treeToArray",value:function(e){var t=[];return function e(n,a){return null!=n.Left&&null!=n.Right?e(n.Left,a.concat(n.Value))+e(n.Right,a.concat(n.Value)):null!=n.Left?e(n.Left,a.concat(n.Value)):null!=n.Right?e(n.Right,a.concat(n.Value)):void t.push(a.concat(n.Value))}(e,[]),t}}]),e}(),R=function(){function e(t){Object(v.a)(this,e),this.Value=t,this.DownLeft=null,this.DownRight=null,this.UpLeft=null,this.UpRight=null}return Object(y.a)(e,null,[{key:"kingTreeToArray",value:function(e){var t=[];return function e(n,a){return null!=n.DownLeft&&null!=n.DownRight&&null!=n.UpLeft&&null!=n.UpRight?e(n.DownLeft,a.concat(n.Value))+e(n.DownRight,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.DownLeft&&null!=n.DownRight&&null!=n.UpLeft?e(n.DownLeft,a.concat(n.Value))+e(n.DownRight,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value)):null!=n.DownLeft&&null!=n.DownRight&&null!=n.UpRight?e(n.DownLeft,a.concat(n.Value))+e(n.DownRight,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.DownLeft&&null!=n.UpLeft&&null!=n.UpRight?e(n.DownLeft,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.DownRight&&null!=n.UpLeft&&null!=n.UpRight?e(n.DownRight,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.DownLeft&&null!=n.DownRight?e(n.DownLeft,a.concat(n.Value))+e(n.DownRight,a.concat(n.Value)):null!=n.DownLeft&&null!=n.UpLeft?e(n.DownLeft,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value)):null!=n.DownLeft&&null!=n.UpRight?e(n.DownLeft,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.DownRight&&null!=n.UpLeft?e(n.DownRight,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value)):null!=n.DownLeft&&null!=n.UpRight?e(n.DownLeft,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.UpLeft&&null!=n.UpRight?e(n.UpLeft,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.DownLeft?e(n.DownLeft,a.concat(n.Value)):null!=n.DownRight?e(n.DownRight,a.concat(n.Value)):null!=n.UpLeft?e(n.UpLeft,a.concat(n.Value)):null!=n.UpRight?e(n.UpRight,a.concat(n.Value)):void t.push(a.concat(n.Value))}(e,[]),t}}]),e}();function C(e,t,n){try{return 5===e[t-1][n-1]||6===e[t-1][n-1]}catch(a){return!1}}function P(e,t,n){try{return 5===e[t-1][n+1]||6===e[t-1][n+1]}catch(a){return!1}}function N(e,t,n){try{return 5===e[t+1][n-1]||6===e[t+1][n-1]}catch(a){return!1}}function M(e,t,n){try{return 5===e[t+1][n+1]||6===e[t+1][n+1]}catch(a){return!1}}function T(e,t,n,a){return{takeHeight:e,takeWidth:t,nextHeight:n,nextWidth:a}}function S(e,t,n,a,i){try{a.includes(e[t+1][n-1])&&(5!==e[t+2][n-2]&&6!==e[t+2][n-2]||(i.Left=new k(T(t+1,n-1,t+2,n-2)),S(e,t+2,n-2,a,i.Left)))}catch(c){}try{a.includes(e[t+1][n+1])&&(5!==e[t+2][n+2]&&6!==e[t+2][n+2]||(i.Right=new k(T(t+1,n+1,t+2,n+2)),S(e,t+2,n+2,a,i.Right)))}catch(r){}return i}function L(e,t,n,a,i){try{a.includes(e[t-1][n-1])&&(5!==e[t-2][n-2]&&6!==e[t-2][n-2]||(i.Left=new k(T(t-1,n-1,t-2,n-2)),L(e,t-2,n-2,a,i.Left)))}catch(c){}try{a.includes(e[t-1][n+1])&&(5!==e[t-2][n+2]&&6!==e[t-2][n+2]||(i.Right=new k(T(t-1,n+1,t-2,n+2)),L(e,t-2,n+2,a,i.Right)))}catch(r){}return i}function D(e,t,n,a,i,c,r){try{c.includes(e[a+1][i-1])&&(5!==e[a+2][i-2]&&6!==e[a+2][i-2]||t===a+2&&n===i-2||(r.DownLeft=new R(T(a+1,i-1,a+2,i-2)),D(e,a,i,a+2,i-2,c,r.DownLeft)))}catch(s){}try{c.includes(e[a+1][i+1])&&(5!==e[a+2][i+2]&&6!==e[a+2][i+2]||t===a+2&&n===i+2||(r.DownRight=new R(T(a+1,i+1,a+2,i+2)),D(e,a,i,a+2,i+2,c,r.DownRight)))}catch(l){}try{c.includes(e[a-1][i-1])&&(5!==e[a-2][i-2]&&6!==e[a-2][i-2]||t===a-2&&n===i-2||(r.UpLeft=new R(T(a-1,i-1,a-2,i-2)),D(e,a,i,a-2,i-2,c,r.UpLeft)))}catch(o){}try{c.includes(e[a-1][i+1])&&(5!==e[a-2][i+2]&&6!==e[a-2][i+2]||t===a-2&&n===i+2||(r.UpRight=new R(T(a-1,i+1,a-2,i+2)),D(e,a,i,a-2,i+2,c,r.UpRight)))}catch(h){}return r}function U(e,t,n,a){return{currentHeight:e,currentWidth:t,nextHeight:n,nextWidth:a,takes:[]}}function E(e,t){for(var n=[],a=0;a<e.length;a++)for(var i=0;i<e[a].length;i++){var c=e[a][i];if(1===c&&1===t){C(e,a,i)&&n.push(U(a,i,a-1,i-1)),P(e,a,i)&&n.push(U(a,i,a-1,i+1));var r=L(e,a,i,[2],new k({currentHeight:a,currentWidth:i}));if(null!=r.Left||null!=r.Right){var s=k.treeToArray(r);n=n.concat(V(s))}}else if(2===c&&2===t){N(e,a,i)&&n.push(U(a,i,a+1,i-1)),M(e,a,i)&&n.push(U(a,i,a+1,i+1));var l=S(e,a,i,[1],new k({currentHeight:a,currentWidth:i}));if(null!=l.Left||null!=l.Right){var o=k.treeToArray(l);n=n.concat(V(o))}}else if(3===c&&1===t||4===c&&2===t){N(e,a,i)&&n.push(U(a,i,a+1,i-1)),M(e,a,i)&&n.push(U(a,i,a+1,i+1)),C(e,a,i)&&n.push(U(a,i,a-1,i-1)),P(e,a,i)&&n.push(U(a,i,a-1,i+1));var h=D(e,a,i,a,i,3===c?[2,4]:[1,3],new R({currentHeight:a,currentWidth:i}));if(null!=h.DownLeft||null!=h.DownRight||null!=h.UpLeft||null!=h.UpRight){var u=R.kingTreeToArray(h);n=n.concat(V(u))}}}return n}function V(e){var t=[];return e.forEach((function(e){t=t.concat(function(e){var t=[],n=[];return e.slice(1).forEach((function(a){n.push({height:a.takeHeight,width:a.takeWidth}),t.push({currentHeight:e[0].currentHeight,currentWidth:e[0].currentWidth,nextHeight:a.nextHeight,nextWidth:a.nextWidth,takes:n.slice(0)})})),t}(e))})),t}function H(e,t){return function(e){var t=[];return e.forEach((function(e){if(0===t.length)t.push(e);else{var n=0;t.forEach((function(t){e.height===t.height&&e.width===t.width&&n++})),0===n&&t.push(e)}})),t}(function(e){var t=[];return e.forEach((function(e){t.push({height:e.nextHeight,width:e.nextWidth})})),t}(E(e,t)))}function W(e){var t=Object(i.useState)([[0,2,0,2,0,2,0,2],[2,0,2,0,2,0,2,0],[0,2,0,2,0,2,0,2],[5,0,5,0,5,0,5,0],[0,5,0,5,0,5,0,5],[1,0,1,0,1,0,1,0],[0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0]]),n=Object(l.a)(t,2),c=n[0],r=n[1],s=Object(i.useState)(null),o=Object(l.a)(s,2),h=o[0],u=o[1],d=Object(i.useState)(null),b=Object(l.a)(d,2),g=b[0],v=b[1],y=Object(i.useState)(!0),k=Object(l.a)(y,2),R=k[0],C=k[1],P=R?"Show player tips":"Hide player tips",N=Object(i.useState)(Q()),M=Object(l.a)(N,2),T=M[0],S=M[1],L=Object(i.useState)(!1),D=Object(l.a)(L,2),U=D[0],E=D[1],V=Object(i.useState)(!1),W=Object(l.a)(V,2),G=W[0],I=W[1],A=Object(i.useState)([]),B=Object(l.a)(A,2),F=B[0],q=B[1],z=Object(i.useState)(!1),K=Object(l.a)(z,2),J=K[0],Y=K[1];function Q(){return c.map((function(e,t){var n=t;return Object(a.jsx)("tr",{children:e.map((function(e,t){return Object(a.jsx)("td",{className:"p-0",children:Object(a.jsx)(f,{state:e,y:n,x:t,setSquareToMoveTo:v,setCounterToMove:u})},n+t)}))},n)}))}function X(){c[h.height][h.width]=5,c[g.height][g.width]=h.state,$(),r(c),S(Q()),e.setTurn(!e.turn)}function Z(t,n){c[h.height][h.width]=5,c[g.height][g.width]=h.state,1===c[t][n]||3===c[t][n]?e.setPlayer1Counter(e.player1Counter+1):2!==c[t][n]&&4!==c[t][n]||e.setPlayer2Counter(e.player2Counter+1),c[t][n]=5,$(),r(c),S(Q()),e.setTurn(!e.turn)}function $(){1===h.state?0===g.height&&(c[g.height][g.width]=3):2===h.state&&7===g.height&&(c[g.height][g.width]=4)}function _(){for(var e=0;e<c.length;e++)for(var t=0;t<c[e].length;t++)6===c[e][t]&&(c[e][t]=5);r(c),S(Q())}function ee(e){try{return c[g.height-1][g.width-1]===e&&(5===c[g.height-2][g.width-2]||6===c[g.height-2][g.width-2])||c[g.height-1][g.width+1]===e&&(5===c[g.height-2][g.width+2]||6===c[g.height-2][g.width+2])}catch(t){return!1}}function te(e){try{return c[g.height+1][g.width-1]===e&&(5===c[g.height+2][g.width-2]||6===c[g.height+2][g.width-2])||c[g.height+1][g.width+1]===e&&(5===c[g.height+2][g.width+2]||6===c[g.height+2][g.width+2])}catch(t){return!1}}function ne(e){return h.height+e===g.height&&(h.width-1===g.width||h.width+1===g.width)}function ae(e,t){if(h.height+e===g.height&&(h.width-2===g.width||h.width+2===g.width)){var n=(g.height+h.height)/2,a=(g.width+h.width)/2;if(c[n][a]===t)return{result:!0,height:n,width:a}}return{result:!1}}function ie(){for(var t=[],n=0;n<c.length;n++)t[n]=c[n].slice();q((function(n){return[].concat(Object(j.a)(n),[{turn:e.turn,board:t}])}))}function ce(e){for(var t=0,n=0;n<c.length;n++)for(var a=0;a<c[n].length;a++)c[n][a]!==e&&c[n][a]!==e+2||t++;return t}return Object(i.useEffect)((function(){if(null!=h&&null!=g){var t=!1;if(!0===e.turn&&1===h.state){var n=ae(-2,2);n.result?(ie(),Z(n.height,n.width),t=!0,ee(2)&&E(!0)):ne(-1)&&(ie(),X(),t=!0)}if(!1===e.turn&&2===h.state){var a=ae(2,1);a.result?(ie(),Z(a.height,a.width),t=!0,ee(1)&&E(!0)):ne(1)&&(ie(),X(),t=!0)}if(3===h.state||4===h.state)if(h.height-1===g.height||h.height+1===g.height)h.width-1!==g.width&&h.width+1!==g.width||(3===h.state&&!0===e.turn||4===h.state&&!1===e.turn)&&(ie(),X(),t=!0);else if((h.height-2===g.height||h.height+2===g.height)&&(h.width-2===g.width||h.width+2===g.width)){var i=(g.height+h.height)/2,r=(g.width+h.width)/2;!0===e.turn?3!==h.state||2!==c[i][r]&&4!==c[i][r]||(ie(),Z(i,r),t=!0,(ee(2)||ee(4)||te(2)||te(4))&&E(!0)):!1===e.turn&&(4!==h.state||1!==c[i][r]&&3!==c[i][r]||(ie(),Z(i,r),t=!0,(ee(1)||ee(3)||te(1)||te(3))&&E(!0)))}!1===t&&Y(!0),_(),C(!0),u(null),v(null),function(){var t=H(c,1),n=H(c,2);0===t.length&&0===n.length?(e.setResultsModalTitle("Tied game"),e.setResultsModalMessage("No player can move. Therefore the game ends in a tie. I hope you had fun playing."),e.setShowResultModal(!0)):0===t.length?(e.setResultsModalTitle("Player 2 wins"),e.setResultsModalMessage("Player 1 can no longer move. Player 2 wins. I hope you had fun playing."),e.setShowResultModal(!0)):0===n.length&&(e.setResultsModalTitle("Player 1 wins"),e.setResultsModalMessage("Player 2 can no longer move. Player 1 wins. I hope you had fun playing."),e.setShowResultModal(!0))}()}}),[g,h,c]),Object(i.useEffect)((function(){G&&(e.setTurn(!e.turn),I(!1))}),[G,e]),Object(a.jsxs)("div",{className:"container fluid",children:[Object(a.jsx)("div",{className:"d-flex justify-content-center mb-3",children:Object(a.jsx)("h2",{children:"2 Player Mode"})}),Object(a.jsxs)(m.a,{className:"d-flex justify-content-center mb-2",children:[Object(a.jsx)(w.a,{className:"ml-2 mr-2 mb-4",children:Object(a.jsx)(p.a,{onClick:function(){R?(!0===e.turn?H(c,1).forEach((function(e){c[e.height][e.width]=6})):!1===e.turn&&H(c,2).forEach((function(e){c[e.height][e.width]=6})),C(!1)):(_(),C(!0)),r(c),S(Q())},size:"lg",children:P})}),Object(a.jsx)(w.a,{className:"ml-2 mr-2 mb-4",children:Object(a.jsx)(p.a,{onClick:function(){if(0!==F.length){!1===R&&C(!0);for(var t=F[F.length-1],n=0;n<c.length;n++)for(var a=0;a<c[n].length;a++)6===t.board[n][a]?c[n][a]=5:c[n][a]!==t.board[n][a]&&(c[n][a]=t.board[n][a]);e.setTurn(t.turn),F.pop();var i=12-ce(1);e.setPlayer1Counter(i);var r=12-ce(2);e.setPlayer2Counter(r),S(Q())}},size:"lg",children:"Undo"})}),Object(a.jsx)(w.a,{className:"ml-2 mr-2 mb-4",children:Object(a.jsx)(p.a,{onClick:function(){!0===e.turn?(e.setResultsModalTitle("Player 2 wins"),e.setResultsModalMessage("Player 1 has given up on the game.")):(e.setResultsModalTitle("Player 1 wins"),e.setResultsModalMessage("Player 2 has given up on the game.")),e.setShowResultModal(!0)},variant:"danger",size:"lg",children:"Give up"})})]}),Object(a.jsx)(O,{show:U,update:E,setJumpModalValue:I}),Object(a.jsx)(x,{show:J,update:Y}),Object(a.jsx)("div",{className:"d-flex justify-content-center",children:Object(a.jsx)("table",{className:"gameBorder",children:Object(a.jsx)("tbody",{className:"border border-dark",children:T})})})]})}var G=n(20);function I(e,t){var n=[];return E(e,t).forEach((function(t){for(var a=[],i=0;i<e.length;i++)a[i]=e[i].slice();t.takes.forEach((function(e){a[e.height][e.width]=5}));var c=a[t.currentHeight][t.currentWidth];a[t.currentHeight][t.currentWidth]=5,a[t.nextHeight][t.nextWidth]=c,t.board=a,n.push(t)})),n}function A(e){for(var t=0,n=0,a=0;a<e.length;a++)for(var i=0;i<e[a].length;i++)1===e[a][i]?t+=1:2===e[a][i]?n+=1:3===e[a][i]?t+=2:4===e[a][i]&&(n+=2);return n-t}function B(e,t,n){if(0===t)return[A(e),e];if(n){var a=-1e3,i=null;return I(e,2).forEach((function(e){var n=B(e.board,t-1,!1)[0];(a=Math.max(a,n))===n&&(i=e)})),[a,i]}var c=1e3,r=null;return I(e,1).forEach((function(e){var n=B(e.board,t-1,!0)[0];(c=Math.min(c,n))===n&&(r=e)})),[c,r]}function F(e,t){var n=[];return E(e,t).forEach((function(t){for(var a=[],i=0;i<e.length;i++)a[i]=e[i].slice();t.takes.forEach((function(e){a[e.height][e.width]=5}));var c=a[t.currentHeight][t.currentWidth];a[t.currentHeight][t.currentWidth]=5,a[t.nextHeight][t.nextWidth]=c,t.board=a,n.push(t)})),n}function q(e){for(var t=0,n=0,a=z(E(e,1)),i=z(E(e,2)),c=0;c<e.length;c++)for(var r=0;r<e[c].length;r++)1===e[c][r]?K(i,c,r)?t+=2:t+=3:2===e[c][r]?K(a,c,r)?n+=2:n+=3:3===e[c][r]?K(i,c,r)?t+=1:t+=4:4===e[c][r]&&(K(a,c,r)?n+=1:n+=4);return n-t}function z(e){var t=[];return e.forEach((function(e){e.takes.forEach((function(e){t.push(e)}))})),t}function K(e,t,n){var a=!1;return e.forEach((function(e){e.height===t&&e.width===n&&(a=!0)})),a}function J(e,t,n){if(0===t)return[q(e),e];if(n){var a=-1e3,i=null;return F(e,2).forEach((function(e){var n=J(e.board,t-1,!1)[0];(a=Math.max(a,n))===n&&(i=e)})),[a,i]}var c=1e3,r=null;return F(e,1).forEach((function(e){var n=J(e.board,t-1,!0)[0];(c=Math.min(c,n))===n&&(r=e)})),[c,r]}var Y=c.a.createContext();function Q(e){var t=Object(i.useState)(!1),n=Object(l.a)(t,2),c=n[0],r=n[1],s=Object(i.useState)(1),o=Object(l.a)(s,2),h=o[0],u=o[1],d=Object(i.useState)(!0),j=Object(l.a)(d,2),b=j[0],f=j[1];return Object(a.jsx)(Y.Provider,{value:{pcOr2Player:c,handlePcOr2PlayerChange:function(e){r("true"===e.target.value),"false"===e.target.value&&u(1)},difficulty:h,handleDifficulty:function(e){u(parseInt(e.target.value))},whoGoesFirst:b,setWhoGoesFirst:f,handleWhoGoesFirstChange:function(e){f("true"===e.target.value)}},children:e.children})}function X(e){var t=Object(i.useState)([[0,2,0,2,0,2,0,2],[2,0,2,0,2,0,2,0],[0,2,0,2,0,2,0,2],[5,0,5,0,5,0,5,0],[0,5,0,5,0,5,0,5],[1,0,1,0,1,0,1,0],[0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0]]),n=Object(l.a)(t,2),c=n[0],r=n[1],s=Object(i.useState)(null),o=Object(l.a)(s,2),h=o[0],u=o[1],d=Object(i.useState)(null),b=Object(l.a)(d,2),g=b[0],v=b[1],y=Object(i.useState)(!0),k=Object(l.a)(y,2),R=k[0],C=k[1],P=R?"Show player tips":"Hide player tips",N=Object(i.useState)(ne()),M=Object(l.a)(N,2),T=M[0],S=M[1],L=Object(i.useState)(!1),D=Object(l.a)(L,2),U=D[0],V=D[1],W=Object(i.useState)(null),I=Object(l.a)(W,2),A=I[0],F=I[1],q=Object(i.useState)([]),z=Object(l.a)(q,2),K=z[0],Q=z[1],X=Object(i.useContext)(Y),Z=Object(i.useState)(!1),$=Object(l.a)(Z,2),_=$[0],ee=$[1],te=1===X.difficulty?"Easy":2===X.difficulty?"Medium":"Hard";function ne(){return c.map((function(e,t){var n=t;return Object(a.jsx)("tr",{children:e.map((function(e,t){return Object(a.jsx)("td",{className:"p-0",children:Object(a.jsx)(f,{state:e,y:n,x:t,setSquareToMoveTo:v,setCounterToMove:u})},n+t)}))},n)}))}function ae(){c[h.height][h.width]=5,c[g.height][g.width]=h.state,ce(),r(c),S(ne()),e.setTurn(!1)}function ie(t,n){c[h.height][h.width]=5,c[g.height][g.width]=h.state,2!==c[t][n]&&4!==c[t][n]||e.setPlayer2Counter(e.player2Counter+1),c[t][n]=5,ce(),r(c),S(ne()),e.setTurn(!1)}function ce(){1===h.state&&0===g.height&&(c[g.height][g.width]=3)}function re(){for(var e=0;e<c.length;e++)for(var t=0;t<c[e].length;t++)6===c[e][t]&&(c[e][t]=5);r(c),S(ne())}function se(){var t=!1,n=H(c,1),a=H(c,2);return 0===n.length&&0===a.length?(e.setResultsModalTitle("Tied game"),e.setResultsModalMessage("No player can move. Therefore the game ends in a tie. I hope you had fun playing."),e.setShowResultModal(!0),t=!0):0===n.length?(e.setResultsModalTitle("Player 2 wins"),e.setResultsModalMessage("Player 1 can no longer move. Player 2 wins. I hope you had fun playing."),e.setShowResultModal(!0),t=!0):0===a.length&&(e.setResultsModalTitle("Player 1 wins"),e.setResultsModalMessage("Player 2 can no longer move. Player 1 wins. I hope you had fun playing."),e.setShowResultModal(!0),t=!0),t}function le(e){try{return c[g.height-1][g.width-1]===e&&(5===c[g.height-2][g.width-2]||6===c[g.height-2][g.width-2])||c[g.height-1][g.width+1]===e&&(5===c[g.height-2][g.width+2]||6===c[g.height-2][g.width+2])}catch(t){return!1}}function oe(e){try{return c[g.height+1][g.width-1]===e&&(5===c[g.height+2][g.width-2]||6===c[g.height+2][g.width-2])||c[g.height+1][g.width+1]===e&&(5===c[g.height+2][g.width+2]||6===c[g.height+2][g.width+2])}catch(t){return!1}}function he(){for(var t=[],n=0;n<c.length;n++)t[n]=c[n].slice();Q((function(n){return[].concat(Object(j.a)(n),[{turn:e.turn,board:t}])}))}function ue(e){for(var t=0,n=0;n<c.length;n++)for(var a=0;a<c[n].length;a++)c[n][a]!==e&&c[n][a]!==e+2||t++;return t}function de(){setTimeout((function(){var t;if(null!==(t=1===X.difficulty?function(e){var t=E(e,2),n=t.filter((function(e){return e.takes.length>0}));return 0!==n.length?n[Math.floor(Math.random()*n.length)]:0!==t.length?t[Math.floor(Math.random()*t.length)]:void 0}(c):2===X.difficulty?B(c,6,!0)[1]:J(c,4,!0)[1])&&t!=={}&&void 0!==t){0!==t.takes.length&&(t.takes.forEach((function(e){c[e.height][e.width]=5})),e.setPlayer1Counter(e.player1Counter+t.takes.length));var n=c[t.currentHeight][t.currentWidth];c[t.currentHeight][t.currentWidth]=5,c[t.nextHeight][t.nextWidth]=n,7===t.nextHeight&&(c[t.nextHeight][t.nextWidth]=4),r(c),S(ne()),e.setTurn(!0),se()}}),500)}return Object(i.useEffect)((function(){var t,n=!0,a=!1;if(e.turn&&null!=h&&null!=g){if(1===h.state){var i=function(e,t){if(h.height+e===g.height&&(h.width-2===g.width||h.width+2===g.width)){var n=(g.height+h.height)/2,a=(g.width+h.width)/2;if(c[n][a]===t)return{result:!0,height:n,width:a}}return{result:!1}}(-2,2);i.result?(he(),ie(i.height,i.width),a=!0,le(2)&&(n=!1,V(!0))):(t=-1,h.height+t!==g.height||h.width-1!==g.width&&h.width+1!==g.width||(he(),ae(),a=!0))}else if(3===h.state)if(h.height-1===g.height||h.height+1===g.height)h.width-1!==g.width&&h.width+1!==g.width||(he(),ae(),a=!0);else if((h.height-2===g.height||h.height+2===g.height)&&(h.width-2===g.width||h.width+2===g.width)){var r=(g.height+h.height)/2,s=(g.width+h.width)/2;2!==c[r][s]&&4!==c[r][s]||(he(),ie(r,s),a=!0,(le(2)||le(4)||oe(2)||oe(4))&&(n=!1,V(!0)))}re(),C(!0),u(null),v(null),se()&&(n=!1),n&&a?de():!1===a&&ee(!0)}}),[g,h,c]),Object(i.useEffect)((function(){A?(e.setTurn(!0),F(null)):!1===A&&(de(),F(null))}),[A,e]),!1===X.whoGoesFirst&&(de(),X.setWhoGoesFirst(null)),Object(a.jsxs)(G.a,{fluid:!0,children:[Object(a.jsx)("div",{className:"d-flex justify-content-center mb-3",children:Object(a.jsxs)("h2",{children:["PC Mode: ",te]})}),Object(a.jsxs)(m.a,{className:"d-flex justify-content-center mb-2",children:[Object(a.jsx)(w.a,{className:"ml-2 mr-2 mb-4",children:Object(a.jsx)(p.a,{onClick:function(){e.turn&&(R?(!0===e.turn&&H(c,1).forEach((function(e){c[e.height][e.width]=6})),C(!1)):(re(),C(!0)),r(c),S(ne()))},size:"lg",children:P})}),Object(a.jsx)(w.a,{className:"ml-2 mr-2 mb-4",children:Object(a.jsx)(p.a,{onClick:function(){if(0!==K.length){!1===R&&C(!0);for(var t=K[K.length-1],n=0;n<c.length;n++)for(var a=0;a<c[n].length;a++)6===t.board[n][a]?c[n][a]=5:c[n][a]!==t.board[n][a]&&(c[n][a]=t.board[n][a]);e.setTurn(t.turn),K.pop();var i=12-ue(1);e.setPlayer1Counter(i);var r=12-ue(2);e.setPlayer2Counter(r),S(ne())}},size:"lg",children:"Undo"})}),Object(a.jsx)(w.a,{className:"ml-2 mr-2 mb-4",children:Object(a.jsx)(p.a,{onClick:function(){!0===e.turn&&(e.setResultsModalTitle("Player 2 wins"),e.setResultsModalMessage("Player 1 has given up on the game."),e.setShowResultModal(!0))},variant:"danger",size:"lg",children:"Give up"})})]}),Object(a.jsx)(O,{show:U,update:V,setJumpModalValue:F}),Object(a.jsx)(x,{show:_,update:ee}),Object(a.jsx)("div",{className:"d-flex justify-content-center",children:Object(a.jsx)("table",{className:"gameBorder",children:Object(a.jsx)("tbody",{className:"border border-dark",children:T})})})]})}function Z(e){return Object(a.jsxs)("div",{children:[Object(a.jsxs)(o.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle2 red center"+(!0===e.turn?" yellow":"")}),Object(a.jsx)("h3",{className:"p-4",children:"Player 1"})]}),Object(a.jsx)("br",{}),Object(a.jsxs)(o.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle2 blue center"+(!1===e.turn?" yellow":"")}),Object(a.jsx)("h3",{className:"p-4",children:"Player 2"})]})]})}function $(e){return Object(a.jsxs)("div",{children:[Object(a.jsxs)(o.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle2 red center"}),Object(a.jsx)("h3",{className:"p-4",children:"Single"})]}),Object(a.jsx)("br",{}),Object(a.jsxs)(o.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle2 red center",children:"K"}),Object(a.jsx)("h3",{className:"p-4",children:"King"})]})]})}function _(e){return Object(a.jsxs)("div",{children:[Object(a.jsxs)(o.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle2 red center"}),Object(a.jsx)("h3",{className:"m-0 p-4",children:e.player1Counter})]}),Object(a.jsx)("br",{}),Object(a.jsxs)(o.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle2 blue center"}),Object(a.jsx)("h3",{className:"p-4",children:e.player2Counter})]})]})}function ee(e){var t=function(){return e.update(!1)};return Object(a.jsx)("div",{children:Object(a.jsxs)(g.a,{show:e.show,onHide:t,backdrop:"static",children:[Object(a.jsx)(g.a.Header,{closeButton:!0,children:Object(a.jsx)(g.a.Title,{children:e.title})}),Object(a.jsx)(g.a.Body,{children:e.message}),Object(a.jsxs)(g.a.Footer,{children:[Object(a.jsx)(p.a,{variant:"danger",onClick:t,children:"Close"}),Object(a.jsx)(p.a,{variant:"success",onClick:function(){return window.location.reload()},children:"Restart"})]})]})})}function te(e){var t=Object(i.useState)(0),n=Object(l.a)(t,2),c=n[0],r=n[1],s=Object(i.useState)(0),u=Object(l.a)(s,2),j=u[0],b=u[1],f=Object(i.useState)(!1),g=Object(l.a)(f,2),p=g[0],O=g[1],x=Object(i.useState)(""),m=Object(l.a)(x,2),w=m[0],v=m[1],y=Object(i.useState)(""),k=Object(l.a)(y,2),R=k[0],C=k[1],P=Object(i.useContext)(Y),N=Object(i.useState)(P.whoGoesFirst),M=Object(l.a)(N,2),T=M[0],S=M[1];return Object(i.useEffect)((function(){12===c?(v("Player 2 wins"),C("Well done on finishing the game of draughts. I hope you had fun playing."),O(!0)):12===j&&(v("Player 1 wins"),C("Well done on finishing the game of draughts. I hope you had fun playing."),O(!0))}),[c,j]),Object(a.jsxs)(o.a,{children:[Object(a.jsx)(ee,{show:p,update:O,title:w,message:R}),Object(a.jsx)(h.a,{xl:"1"}),Object(a.jsxs)(h.a,{xl:"7",children:[!0===P.pcOr2Player?Object(a.jsx)(X,{player1Counter:c,setPlayer1Counter:r,player2Counter:j,setPlayer2Counter:b,turn:T,setTurn:S,setResultsModalTitle:v,setShowResultModal:O,setResultsModalMessage:C}):Object(a.jsx)(W,{player1Counter:c,setPlayer1Counter:r,player2Counter:j,setPlayer2Counter:b,turn:T,setTurn:S,setResultsModalTitle:v,setShowResultModal:O,setResultsModalMessage:C}),Object(a.jsx)("br",{})]}),Object(a.jsxs)(h.a,{xl:"3",children:[Object(a.jsx)(d,{title:"Players",innerComponent:Object(a.jsx)(Z,{turn:T})}),Object(a.jsx)("br",{}),Object(a.jsx)(d,{title:"Pieces",innerComponent:Object(a.jsx)($,{})}),Object(a.jsx)("br",{}),Object(a.jsx)(d,{title:"Pieces Taken",innerComponent:Object(a.jsx)(_,{player1Counter:c,player2Counter:j})}),Object(a.jsx)("br",{})]}),Object(a.jsx)(h.a,{xl:"1"})]})}n(62);function ne(){return Object(a.jsx)(G.a,{fluid:!0,children:Object(a.jsxs)(o.a,{children:[Object(a.jsx)(h.a,{xl:"1"}),Object(a.jsxs)(h.a,{xl:"10",children:[Object(a.jsx)("div",{children:Object(a.jsx)("h1",{children:"How To Play Draughts"})}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"Goal"}),Object(a.jsx)("p",{children:"The goal of the game of draughts is to take all of the opponent's pieces."})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"Summary"}),Object(a.jsx)("p",{children:"Draughts is a simple game with limited movement. There are two types of pieces in the game. Singles and kings, they can be differentiated with kings having a 'K' in the centre of the game piece. Singles can only move towards the opponents end of the board whereas kings can move both up and down the board. The game starts with only single pieces in play. Kings can be achieved by a player moving a piece to the far end of the board."}),Object(a.jsx)("p",{children:"Players take it in turn to move a single game piece. Pieces can only move in a diagonal direction by one square therefore not white square can be used. Only one piece can occupy a square. Players can take an opponents piece by jumping a character if the square diagonally behind the piece is available."})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"Rules"}),Object(a.jsxs)("ul",{children:[Object(a.jsx)("li",{children:"Player play the game in turns"}),Object(a.jsx)("li",{children:"Players can only move one piece during a turn"}),Object(a.jsx)("li",{children:"Kings are automatically created"}),Object(a.jsx)("li",{children:"Piece can only move diagonally"}),Object(a.jsx)("li",{children:"Singles only move towards to the opponent"}),Object(a.jsx)("li",{children:"Kings can only move up and down"}),Object(a.jsx)("li",{children:"Pieces can only take a character if the space diagonally behind it is free"})]})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"How to play"}),Object(a.jsx)("p",{children:"A yellow ring will appear around the piece to identify whos turn it is in the players section."}),Object(a.jsx)("p",{children:"The pieces taken section will keep count of the pieces taken, once a player gets to 12 they lose."}),Object(a.jsx)("p",{children:"To move a piece click on the piece you want to move and the square you want to move it to. The game will do the rest and make you the move is valid."}),Object(a.jsx)("p",{children:"The game will automatically king piece."})]})]}),Object(a.jsx)(h.a,{xl:"1"})]})})}var ae=n(50);function ie(e){var t=e.features.map((function(e,t){return Object(a.jsx)("li",{children:e},t)}));return Object(a.jsx)(u.a,{children:Object(a.jsxs)(u.a.Body,{children:[Object(a.jsx)(u.a.Header,{children:Object(a.jsx)("h3",{children:e.title})}),Object(a.jsxs)(u.a.Text,{children:[Object(a.jsx)("h5",{children:"Features"}),Object(a.jsx)("ul",{children:t})]}),Object(a.jsx)(ae.a,{variant:e.colour,children:e.status})]})})}function ce(){return Object(a.jsx)(G.a,{fluid:!0,children:Object(a.jsxs)(o.a,{children:[Object(a.jsx)(h.a,{xl:"1"}),Object(a.jsxs)(h.a,{xl:"10",children:[Object(a.jsxs)("div",{children:[Object(a.jsx)("h1",{children:"About"}),Object(a.jsx)("p",{children:"This game was made in loving memory of my grandad, Ernest Rumbol. My grandad taught me this game many years ago. Over the years we have played thousands of games together. As I got older and understood the game more, the more games I won. However, grandad still loved playing even when he wiped the board clean because he lost the game after the first move. We played with many different rule sets, his favourite was forcing users to take a piece if available, I thought the game was more tactical if you didn't. I hope that people play this game with as much fun as we did."})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"Technical information"}),Object(a.jsxs)("p",{children:["Below lets the tools used to build this web application. You can find the source code at the ",Object(a.jsx)("a",{href:"https://github.com/OllieRumbol/draughtsgame",children:"Git Repo"})]}),Object(a.jsxs)("ul",{children:[Object(a.jsx)("li",{children:Object(a.jsx)("a",{href:"https://reactjs.org/",children:"React with hooks"})}),Object(a.jsx)("li",{children:Object(a.jsx)("a",{href:"https://react-bootstrap.github.io/",children:"React bootstrap"})}),Object(a.jsx)("li",{children:Object(a.jsx)("a",{href:"https://reactrouter.com/web/guides/quick-start",children:"React router"})}),Object(a.jsx)("li",{children:Object(a.jsx)("a",{href:"https://pages.github.com/",children:"Git pages (for hosting)"})}),Object(a.jsx)("li",{children:Object(a.jsx)("a",{href:"https://testing-library.com/docs/react-testing-library/intro/",children:"React testing"})})]})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"Project Plan"}),Object(a.jsxs)("div",{className:"card-columns",children:[Object(a.jsx)(ie,{title:"Draughts Game Phase 1 Epic",colour:"success",features:["React Project Setup \u2714","Board setup \u2714","Counter setup \u2714","UI design \u2714","Move counter \u2714","Take counter \u2714","Game end \u2714","King me \u2714","Turns \u2714"],status:"Complete"}),Object(a.jsx)(ie,{title:"React Router Epic",colour:"success",features:["Setup \u2714","Refactor \u2714","Production changes \u2714"],status:"Complete"}),Object(a.jsx)(ie,{title:"Pages Epic",colour:"success",features:["How to play \u2714","About \u2714"],status:"Complete"}),Object(a.jsx)(ie,{title:"CI/CD and Unit Tests Epic",colour:"warning",features:["Create basic pipeline in yaml \u2714","Setup testing environment and add to pipeline \u2714","Unit test components","Unit test web app logic"],status:"In progress"}),Object(a.jsx)(ie,{title:"Player tips Epic",colour:"success",features:["UI changes to display user tips \u2714","Logic to work out where a player can move \u2714","Logic to work out where a player can take another counter \u2714"],status:"Complete"}),Object(a.jsx)(ie,{title:"Draughts Game Phase 2 Epic",colour:"success",features:["Double jumps \u2714","Game over - no one can move \u2714","Restart \u2714","Undo \u2714","CSS for selecting a counter \u2714"],status:"Complete"}),Object(a.jsx)(ie,{title:"Automated 2nd Player Phase 1 Epic",colour:"success",features:["Game setup page, 2 player or VS PC. Along with other settings \u2714","Web app logic for PC to decide next move (random logic) \u2714","Render PC move on page \u2714"],status:"Complete"}),Object(a.jsx)(ie,{title:"Automated 2nd Player Phase 2 Epic",colour:"success",features:["Use some kind of genetic search algorithm to find best move \u2714","Add new setting to the game setting page for other opponent type \u2714","Use new setting in the frontend \u2714"],status:"Complete"}),Object(a.jsx)(ie,{title:"Mobile responsive UI Epic",colour:"success",features:["Game setup page is mobile responsive \u2714","Game board page is mobile responsive \u2714","How to play page is mobile responsive \u2714","About page is mobile responsive \u2714"],status:"Complete"}),Object(a.jsx)(ie,{title:"Draughts Game Phase 3 Epic",colour:"warning",features:["Setting to decide who goes first \u2714","Setting for if singles can take kings","Update how to play","Give up button \u2714","Go back to player settings","Display mode when against PC \u2714","Better animation when an automated player takes multiple pieces"],status:"In progress"}),Object(a.jsx)(ie,{title:"Automated 2nd Player Phase 3 Epic",colour:"warning",features:["Refactor logic from V1, V2 and V3 \u2714","Improve algorithm with alpha beta pruning","Experiment with different depths \u2714","Improve evaluation function with pieces can be taken \u2714","Add new setting for new mode and use in frontend \u2714","Improve evaluation method for depth of pieces"],status:"In progress"}),Object(a.jsx)(ie,{title:"Tutorial Epic",colour:"danger",features:[],status:"Not started"}),Object(a.jsx)(ie,{title:"Support Epic",colour:"danger",features:["Game tips results in no possible moves \u2714 (26/1/21)","Player tips not showing all possible moves for a king \u2714 (31/1/21)","Player tips infinite loop \u2714 (1/2/21)","Double jumps and undo \u2714 (2/2/21)","Undo is hiding player tips when no moves have been made \u2714 (6/2/21)","Change board layout, currently back to front \u2714 (16/2/21)","No more moves check is too late \u2714 (18/2/21)","Clicking off modal closes modal \u2714 (26/2/21)"],status:"Paused due to no further work"}),Object(a.jsx)(ie,{title:"Technical Debt Epic Epic",colour:"danger",features:["Refactor main use effect logic \u2714 (28/1/21)","Refactor player tips logic \u2714 (28/2/21)","Replace JS alert with bootstrap modal for invalid more \u2714 (27/2/21)","Refactor finding moves logic, going through the board twice \u2714 (6/3/21)"],status:"Paused due to no further work"})]})]}),Object(a.jsx)("br",{})]}),Object(a.jsx)(h.a,{xl:"1"})]})})}n(63);function re(e){var t=Object(i.useContext)(Y);return Object(a.jsxs)(G.a,{fluid:!0,children:[Object(a.jsxs)(o.a,{children:[Object(a.jsx)(h.a,{xl:"1"}),Object(a.jsxs)(h.a,{xl:"10",children:[Object(a.jsx)("div",{children:Object(a.jsx)("h1",{children:"Game settings"})}),Object(a.jsxs)("div",{children:[Object(a.jsx)("div",{children:Object(a.jsx)("h2",{className:"pb-2",children:"Opponent"})}),Object(a.jsx)("div",{children:Object(a.jsxs)("label",{className:"radioContainer",children:[Object(a.jsx)("div",{className:"topper",children:"2 Player"}),Object(a.jsx)("input",{type:"radio",name:"radio",value:"false",onChange:t.handlePcOr2PlayerChange,checked:!1===t.pcOr2Player}),Object(a.jsx)("span",{className:"checkMark"})]})}),Object(a.jsx)("div",{children:Object(a.jsxs)("label",{className:"radioContainer",children:[Object(a.jsx)("div",{className:"topper",children:"PC"}),Object(a.jsx)("input",{type:"radio",name:"radio",value:"true",onChange:t.handlePcOr2PlayerChange,checked:!0===t.pcOr2Player}),Object(a.jsx)("span",{className:"checkMark"})]})}),!0===t.pcOr2Player&&Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{className:"pb-2",children:"Difficulty"}),Object(a.jsx)("div",{children:Object(a.jsxs)("label",{className:"radioContainer",children:[Object(a.jsx)("div",{className:"topper",children:"Easy"}),Object(a.jsx)("input",{type:"radio",name:"radio2",value:"1",onChange:t.handleDifficulty,checked:1===t.difficulty}),Object(a.jsx)("span",{className:"checkMark"})]})}),Object(a.jsx)("div",{children:Object(a.jsxs)("label",{className:"radioContainer",children:[Object(a.jsx)("div",{className:"topper",children:"Medium"}),Object(a.jsx)("input",{type:"radio",name:"radio2",value:"2",onChange:t.handleDifficulty,checked:2===t.difficulty}),Object(a.jsx)("span",{className:"checkMark"})]})}),Object(a.jsx)("div",{children:Object(a.jsxs)("label",{className:"radioContainer",children:[Object(a.jsx)("div",{className:"topper",children:"Hard"}),Object(a.jsx)("input",{type:"radio",name:"radio2",value:"3",onChange:t.handleDifficulty,checked:3===t.difficulty}),Object(a.jsx)("span",{className:"checkMark"})]})})]}),Object(a.jsx)("div",{children:Object(a.jsx)("h2",{className:"pb-2",children:"Who goes first"})}),Object(a.jsx)("div",{children:Object(a.jsxs)("label",{className:"radioContainer",children:[Object(a.jsx)("div",{className:"topper",children:"Player 1"}),Object(a.jsx)("input",{type:"radio",name:"radio3",value:"true",onChange:t.handleWhoGoesFirstChange,checked:!0===t.whoGoesFirst}),Object(a.jsx)("span",{className:"checkMark"})]})}),Object(a.jsx)("div",{children:Object(a.jsxs)("label",{className:"radioContainer",children:[Object(a.jsx)("div",{className:"topper",children:"Player 2"}),Object(a.jsx)("input",{type:"radio",name:"radio3",value:"false",onChange:t.handleWhoGoesFirstChange,checked:!1===t.whoGoesFirst}),Object(a.jsx)("span",{className:"checkMark"})]})})]}),Object(a.jsx)("div",{children:Object(a.jsx)(p.a,{variant:"success",onClick:function(){e.setHasSetGameSettings(!0)},size:"lg",children:"Submit"})})]}),Object(a.jsx)(h.a,{xl:"1"})]}),Object(a.jsx)("br",{})]})}var se=n(32),le=n(9),oe=n(49);n(64);function he(){var e=Object(i.useState)(!1),t=Object(l.a)(e,2),n=t[0],c=t[1];return Object(a.jsx)(Q,{children:Object(a.jsx)(se.a,{children:Object(a.jsxs)(G.a,{fluid:!0,children:[Object(a.jsx)(oe.a,{fluid:!0,className:"pb-3",children:Object(a.jsxs)(G.a,{children:[Object(a.jsx)("div",{className:"d-flex justify-content-center",children:Object(a.jsx)("h1",{"data-testid":"title",className:"font-weight-bold title",children:"Draughts Game"})}),Object(a.jsx)("br",{}),Object(a.jsx)("div",{className:"d-flex justify-content-center",children:Object(a.jsx)("h4",{children:"A draughts game built in react js"})}),Object(a.jsx)("hr",{className:"my-4"}),Object(a.jsxs)(m.a,{className:"d-flex justify-content-center",children:[Object(a.jsx)(se.b,{to:"/",children:Object(a.jsx)(w.a,{className:"mr-3 mb-3",children:Object(a.jsx)(p.a,{"data-testid":"link",variant:"primary",size:"lg",children:"Home"})})}),Object(a.jsx)(se.b,{to:"/howtoplay",children:Object(a.jsx)(w.a,{className:"mr-3 mb-3",children:Object(a.jsx)(p.a,{"data-testid":"link",variant:"primary",size:"lg",children:"How to play"})})}),Object(a.jsx)(se.b,{to:"/about",children:Object(a.jsx)(w.a,{className:"mr-3 mb-3",children:Object(a.jsx)(p.a,{"data-testid":"link",variant:"primary",size:"lg",children:"About"})})})]})]})}),Object(a.jsx)("main",{children:Object(a.jsxs)(le.c,{children:[Object(a.jsx)(le.a,{path:"/",exact:!0,component:function(){return n?Object(a.jsx)(te,{}):Object(a.jsx)(re,{setHasSetGameSettings:c})}}),Object(a.jsx)(le.a,{path:"/howtoplay",exact:!0,component:function(){return Object(a.jsx)(ne,{})}}),Object(a.jsx)(le.a,{path:"/about",exact:!0,component:function(){return Object(a.jsx)(ce,{})}})]})})]})})})}s.a.render(Object(a.jsx)(he,{}),document.getElementById("root"))}},[[68,1,2]]]);
//# sourceMappingURL=main.1af7025c.chunk.js.map