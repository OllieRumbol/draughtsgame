(this.webpackJsonpdraughtsgame=this.webpackJsonpdraughtsgame||[]).push([[0],{33:function(e,t,n){},56:function(e,t,n){},57:function(e,t,n){},61:function(e,t,n){},62:function(e,t,n){},63:function(e,t,n){},64:function(e,t,n){},68:function(e,t,n){"use strict";n.r(t);var c=n(0),a=n(1),i=n.n(a),r=n(24),s=n.n(r),l=(n(56),n(6)),h=n(12),o=n(13),u=n(22);n(25);function d(e){return Object(c.jsx)("div",{children:Object(c.jsxs)(u.a,{children:[Object(c.jsx)(u.a.Header,{children:Object(c.jsx)("h2",{children:e.title})}),Object(c.jsx)(u.a.Body,{children:e.innerComponent})]})})}var j=n(38);n(33);function b(e){var t=function(){var e=Object(a.useRef)(null),t=Object(a.useState)(!1),n=Object(l.a)(t,2),c=n[0],i=n[1];function r(t){e.current&&e.current.contains(t.target)?i(!0):i(!1)}return Object(a.useEffect)((function(){return document.addEventListener("mousedown",r,!0),function(){document.removeEventListener("mousedown",r,!0)}}),[e]),{visible:c,ref:e}}(),n=t.visible,i=t.ref,r=n?"circle red center yellow":"circle red center",s=n?"circle blue center yellow":"circle blue center",h=e.state,o=e.y,u=e.x,d=e.setCounterToMove;function j(){d({state:h,height:o,width:u})}return 1===e.state?Object(c.jsx)("div",{ref:i,className:r,onClick:j}):2===e.state?Object(c.jsx)("div",{ref:i,className:s,onClick:j}):3===e.state?Object(c.jsx)("div",{ref:i,className:r,onClick:j,children:"K"}):4===e.state?Object(c.jsx)("div",{ref:i,className:s,onClick:j,children:"K"}):Object(c.jsx)("div",{})}n(57);function g(e){var t=e.state,n=6===t?"square tip":0!==t?"square black":"square",a=e.y,i=e.x,r=e.setSquareToMoveTo;return Object(c.jsx)("div",{className:n,onClick:function(){5!==t&&6!==t||r({height:a,width:i})},children:Object(c.jsx)(b,{state:t,y:a,x:i,setCounterToMove:e.setCounterToMove})})}var f=n(16),p=n(10);function O(e){var t=function(){return e.update(!1)};return Object(c.jsx)("div",{children:Object(c.jsxs)(f.a,{show:e.show,onHide:t,children:[Object(c.jsx)(f.a.Header,{closeButton:!0,children:Object(c.jsx)(f.a.Title,{children:"Would you like to take again?"})}),Object(c.jsx)(f.a.Body,{children:"In draughts players can jump multiple times to take multiple pieces from their opponent."}),Object(c.jsxs)(f.a.Footer,{children:[Object(c.jsx)(p.a,{variant:"primary",onClick:function(){e.setJumpModalValue(!0),t()},children:"Yes"}),Object(c.jsx)(p.a,{variant:"primary",onClick:function(){e.setJumpModalValue(!1),t()},children:"No"})]})]})})}var x=n(27),w=n(20),m=(n(61),[]);function y(e,t,n){try{5!==e[t-1][n-1]&&6!==e[t-1][n-1]||m.push({height:t-1,width:n-1})}catch(c){}try{5!==e[t-1][n+1]&&6!==e[t-1][n+1]||m.push({height:t-1,width:n+1})}catch(a){}}function v(e,t,n){try{5!==e[t+1][n-1]&&6!==e[t+1][n-1]||m.push({height:t+1,width:n-1})}catch(c){}try{5!==e[t+1][n+1]&&6!==e[t+1][n+1]||m.push({height:t+1,width:n+1})}catch(a){}}function R(e,t,n,c){try{c.includes(e[t-1][n-1])&&(5!==e[t-2][n-2]&&6!==e[t-2][n-2]||(m.push({height:t-2,width:n-2}),R(e,t-2,n-2,c)))}catch(a){}try{c.includes(e[t-1][n+1])&&(5!==e[t-2][n+2]&&6!==e[t-2][n+2]||(m.push({height:t-2,width:n+2}),R(e,t-2,n+2,c)))}catch(i){}}function C(e,t,n,c){try{c.includes(e[t+1][n-1])&&(5!==e[t+2][n-2]&&6!==e[t+2][n-2]||(m.push({height:t+2,width:n-2}),C(e,t+2,n-2,c)))}catch(a){}try{c.includes(e[t+1][n+1])&&(5!==e[t+2][n+2]&&6!==e[t+2][n+2]||(m.push({height:t+2,width:n+2}),C(e,t+2,n+2,c)))}catch(i){}}function P(e,t,n,c,a,i){try{i.includes(e[c+1][a-1])&&(5!==e[c+2][a-2]&&6!==e[c+2][a-2]||t===c+2&&n===a-2||(m.push({height:c+2,width:a-2}),P(e,c,a,c+2,a-2,i)))}catch(r){}try{i.includes(e[c+1][a+1])&&(5!==e[c+2][a+2]&&6!==e[c+2][a+2]||t===c+2&&n===a+2||(m.push({height:c+2,width:a+2}),P(e,c,a,c+2,a+2,i)))}catch(s){}try{i.includes(e[c-1][a-1])&&(5!==e[c-2][a-2]&&6!==e[c-2][a-2]||t===c-2&&n===a-2||(m.push({height:c-2,width:a-2}),P(e,c,a,c-2,a-2,i)))}catch(l){}try{i.includes(e[c-1][a+1])&&(5!==e[c-2][a+2]&&6!==e[c-2][a+2]||t===c-2&&n===a+2||(m.push({height:c-2,width:a+2}),P(e,c,a,c-2,a+2,i)))}catch(h){}}function k(e,t){m=[];for(var n=0;n<e.length;n++)for(var c=0;c<e[n].length;c++){var a=e[n][c];a===t&&(1===a?(y(e,n,c),R(e,n,c,[2])):2===a?(v(e,n,c),C(e,n,c,[1])):3===a?(y(e,n,c),v(e,n,c),P(e,n,c,n,c,[2,4])):4===a&&(y(e,n,c),v(e,n,c),P(e,n,c,n,c,[1,3])))}return function(e){var t=[];return e.forEach((function(e){if(0===t.length)t.push(e);else{var n=0;t.forEach((function(t){e.height===t.height&&e.width===t.width&&n++})),0===n&&t.push(e)}})),t}(m)}function N(e){var t=Object(a.useState)([[2,0,2,0,2,0,2,0],[0,2,0,2,0,2,0,2],[2,0,2,0,2,0,2,0],[0,5,0,5,0,5,0,5],[5,0,5,0,5,0,5,0],[0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0],[0,1,0,1,0,1,0,1]]),n=Object(l.a)(t,2),i=n[0],r=n[1],s=Object(a.useState)(null),h=Object(l.a)(s,2),o=h[0],u=h[1],d=Object(a.useState)(null),b=Object(l.a)(d,2),f=b[0],m=b[1],y=Object(a.useState)(!0),v=Object(l.a)(y,2),R=v[0],C=v[1],P=R?"Show player tips":"Hide player tips",N=Object(a.useState)(K()),T=Object(l.a)(N,2),S=T[0],M=T[1],L=Object(a.useState)(!1),U=Object(l.a)(L,2),D=U[0],V=U[1],H=Object(a.useState)(!1),E=Object(l.a)(H,2),I=E[0],W=E[1],G=Object(a.useState)([]),A=Object(l.a)(G,2),q=A[0],B=A[1];function K(){return i.map((function(e,t){var n=t;return Object(c.jsx)("tr",{children:e.map((function(e,t){return Object(c.jsx)("td",{className:"p-0",children:Object(c.jsx)(g,{state:e,y:n,x:t,setSquareToMoveTo:m,setCounterToMove:u})},n+t)}))},n)}))}function J(){i[o.height][o.width]=5,i[f.height][f.width]=o.state,Y(),r(i),M(K()),e.setTurn(!e.turn)}function F(t,n){i[o.height][o.width]=5,i[f.height][f.width]=o.state,1===i[t][n]||3===i[t][n]?e.setPlayer1Counter(e.player1Counter+1):2!==i[t][n]&&4!==i[t][n]||e.setPlayer2Counter(e.player2Counter+1),i[t][n]=5,Y(),r(i),M(K()),e.setTurn(!e.turn)}function Y(){1===o.state?0===f.height&&(i[f.height][f.width]=3):2===o.state&&7===f.height&&(i[f.height][f.width]=4)}function z(){for(var e=0;e<i.length;e++)for(var t=0;t<i[e].length;t++)6===i[e][t]&&(i[e][t]=5);r(i),M(K())}function Q(e){try{return i[f.height-1][f.width-1]===e&&(5===i[f.height-2][f.width-2]||6===i[f.height-2][f.width-2])||i[f.height-1][f.width+1]===e&&(5===i[f.height-2][f.width+2]||6===i[f.height-2][f.width+2])}catch(t){return!1}}function X(e){try{return i[f.height+1][f.width-1]===e&&(5===i[f.height+2][f.width-2]||6===i[f.height+2][f.width-2])||i[f.height+1][f.width+1]===e&&(5===i[f.height+2][f.width+2]||6===i[f.height+2][f.width+2])}catch(t){return!1}}function Z(e){return o.height+e===f.height&&(o.width-1===f.width||o.width+1===f.width)}function $(e,t){if(o.height+e===f.height&&(o.width-2===f.width||o.width+2===f.width)){var n=(f.height+o.height)/2,c=(f.width+o.width)/2;if(i[n][c]===t)return{result:!0,height:n,width:c}}return{result:!1}}function _(){for(var t=[],n=0;n<i.length;n++)t[n]=i[n].slice();B((function(n){return[].concat(Object(j.a)(n),[{turn:e.turn,board:t}])}))}function ee(e){for(var t=0,n=0;n<i.length;n++)for(var c=0;c<i[n].length;c++)i[n][c]!==e&&i[n][c]!==e+2||t++;return t}return Object(a.useEffect)((function(){if(function(){var t=k(i,1).concat(k(i,3)),n=k(i,2).concat(k(i,4));0===t.length&&0===n.length?(e.setResultsModalTitle("Tied game"),e.setResultsModalMessage("No player can move. Therefore the game ends in a tie. I hope you had fun playing."),e.setShowResultModal(!0)):0===t.length?(e.setResultsModalTitle("Player 2 wins"),e.setResultsModalMessage("Player 1 can no longer move. Player 2 wins. I hope you had fun playing."),e.setShowResultModal(!0)):0===n.length&&(e.setResultsModalTitle("Player 1 wins"),e.setResultsModalMessage("Player 2 can no longer move. Player 1 wins. I hope you had fun playing."),e.setShowResultModal(!0))}(),null!=o&&null!=f){if(!0===e.turn&&1===o.state){var t=$(-2,2);t.result?(_(),F(t.height,t.width),Q(2)&&V(!0)):Z(-1)&&(_(),J())}if(!1===e.turn&&2===o.state){var n=$(2,1);n.result?(_(),F(n.height,n.width),Q(1)&&V(!0)):Z(1)&&(_(),J())}if(3===o.state||4===o.state)if(o.height-1===f.height||o.height+1===f.height)o.width-1!==f.width&&o.width+1!==f.width||(3===o.state&&!0===e.turn||4===o.state&&!1===e.turn)&&(_(),J());else if((o.height-2===f.height||o.height+2===f.height)&&(o.width-2===f.width||o.width+2===f.width)){var c=(f.height+o.height)/2,a=(f.width+o.width)/2;!0===e.turn?3!==o.state||2!==i[c][a]&&4!==i[c][a]||(_(),F(c,a),(Q(2)||Q(4)||X(2)||X(4))&&V(!0)):!1===e.turn&&(4!==o.state||1!==i[c][a]&&3!==i[c][a]||(_(),F(c,a),(Q(1)||Q(3)||X(1)||X(3))&&V(!0)))}z(),C(!0),u(null),m(null)}}),[f,o,i]),Object(a.useEffect)((function(){I&&(e.setTurn(!e.turn),W(!1))}),[I,e]),Object(c.jsxs)("div",{className:"container fluid",children:[Object(c.jsx)("div",{className:"d-flex justify-content-center mb-3",children:Object(c.jsx)("h2",{children:"2 Player Mode"})}),Object(c.jsxs)(x.a,{className:"d-flex justify-content-center",children:[Object(c.jsx)(w.a,{className:"ml-2 mr-2 mb-4",children:Object(c.jsx)(p.a,{onClick:function(){R?(!0===e.turn?k(i,1).concat(k(i,3)).forEach((function(e){i[e.height][e.width]=6})):!1===e.turn&&k(i,2).concat(k(i,4)).forEach((function(e){i[e.height][e.width]=6})),C(!1)):(z(),C(!0)),r(i),M(K())},children:P})}),Object(c.jsx)(w.a,{className:"ml-2 mr-2 mb-4",children:Object(c.jsx)(p.a,{onClick:function(){if(0!==q.length){!1===R&&C(!0);for(var t=q[q.length-1],n=0;n<i.length;n++)for(var c=0;c<i[n].length;c++)6===t.board[n][c]?i[n][c]=5:i[n][c]!==t.board[n][c]&&(i[n][c]=t.board[n][c]);e.setTurn(t.turn),q.pop();var a=12-ee(1);e.setPlayer1Counter(a);var r=12-ee(2);e.setPlayer2Counter(r),M(K())}},children:"Undo"})})]}),Object(c.jsx)(O,{show:D,update:V,setJumpModalValue:W}),Object(c.jsx)("div",{className:"d-flex justify-content-center",children:Object(c.jsx)("table",{className:"gameBorder",children:Object(c.jsx)("tbody",{className:"border border-dark",children:S})})})]})}var T=n(19),S=n(43),M=n(44),L=function(){function e(t){Object(S.a)(this,e),this.Value=t,this.Left=null,this.Right=null}return Object(M.a)(e,null,[{key:"treeToArray",value:function(e){var t=[];return function e(n,c){return null!=n.Left&&null!=n.Right?e(n.Left,c.concat(n.Value))+e(n.Right,c.concat(n.Value)):null!=n.Left?e(n.Left,c.concat(n.Value)):null!=n.Right?e(n.Right,c.concat(n.Value)):void t.push(c.concat(n.Value))}(e,[]),t}}]),e}(),U=function(){function e(t){Object(S.a)(this,e),this.Value=t,this.DownLeft=null,this.DownRight=null,this.UpLeft=null,this.UpRight=null}return Object(M.a)(e,null,[{key:"kingTreeToArray",value:function(e){var t=[];return function e(n,c){return null!=n.DownLeft&&null!=n.DownRight&&null!=n.UpLeft&&null!=n.UpRight?e(n.DownLeft,c.concat(n.Value))+e(n.DownRight,c.concat(n.Value))+e(n.UpLeft,c.concat(n.Value)+e(n.UpRight,c.concat(n.Value))):null!=n.DownLeft&&null!=n.DownRight&&null!=n.UpLeft?e(n.DownLeft,c.concat(n.Value))+e(n.DownRight,c.concat(n.Value))+e(n.UpLeft,c.concat(n.Value)):null!=n.DownLeft&&null!=n.DownRight&&null!=n.UpRight?e(n.DownLeft,c.concat(n.Value))+e(n.DownRight,c.concat(n.Value))+e(n.UpRight,c.concat(n.Value)):null!=n.DownLeft&&null!=n.UpLeft&&null!=n.UpRight?e(n.DownLeft,c.concat(n.Value))+e(n.UpLeft,c.concat(n.Value))+e(n.UpRight,c.concat(n.Value)):null!=n.DownRight&&null!=n.UpLeft&&null!=n.UpRight?e(n.DownRight,c.concat(n.Value))+e(n.UpLeft,c.concat(n.Value))+e(n.UpRight,c.concat(n.Value)):null!=n.DownLeft&&null!=n.DownRight?e(n.DownLeft,c.concat(n.Value))+e(n.DownRight,c.concat(n.Value)):null!=n.DownLeft&&null!=n.UpLeft?e(n.DownLeft,c.concat(n.Value))+e(n.UpLeft,c.concat(n.Value)):null!=n.DownLeft&&null!=n.UpRight?e(n.DownLeft,c.concat(n.Value))+e(n.UpRight,c.concat(n.Value)):null!=n.DownRight&&null!=n.UpLeft?e(n.DownRight,c.concat(n.Value))+e(n.UpLeft,c.concat(n.Value)):null!=n.DownLeft&&null!=n.UpRight?e(n.DownLeft,c.concat(n.Value))+e(n.UpRight,c.concat(n.Value)):null!=n.UpLeft&&null!=n.UpRight?e(n.UpLeft,c.concat(n.Value)+e(n.UpRight,c.concat(n.Value))):null!=n.DownLeft?e(n.DownLeft,c.concat(n.Value)):null!=n.DownRight?e(n.DownRight,c.concat(n.Value)):null!=n.UpLeft?e(n.UpLeft,c.concat(n.Value)):null!=n.UpRight?e(n.UpRight,c.concat(n.Value)):void t.push(c.concat(n.Value))}(e,[]),t}}]),e}();function D(e,t,n){try{return 5===e[t-1][n-1]||6===e[t-1][n-1]}catch(c){return!1}}function V(e,t,n){try{return 5===e[t-1][n+1]||6===e[t-1][n+1]}catch(c){return!1}}function H(e,t,n){try{return 5===e[t+1][n-1]||6===e[t+1][n-1]}catch(c){return!1}}function E(e,t,n){try{return 5===e[t+1][n+1]||6===e[t+1][n+1]}catch(c){return!1}}function I(e,t,n,c){return{currentHeight:e,currentWidth:t,nextHeight:n,nextWidth:c,take:!1}}function W(e,t,n,c){return{takeHeight:e,takeWidth:t,nextHeight:n,nextWidth:c}}function G(e,t,n,c,a){try{c.includes(e[t+1][n-1])&&(5!==e[t+2][n-2]&&6!==e[t+2][n-2]||(a.Left=new L(W(t+1,n-1,t+2,n-2)),G(e,t+2,n-2,c,a.Left)))}catch(i){}try{c.includes(e[t+1][n+1])&&(5!==e[t+2][n+2]&&6!==e[t+2][n+2]||(a.Right=new L(W(t+1,n+1,t+2,n+2)),G(e,t+2,n+2,c,a.Right)))}catch(r){}return a}function A(e,t,n,c,a,i,r){try{i.includes(e[c+1][a-1])&&(5!==e[c+2][a-2]&&6!==e[c+2][a-2]||t===c+2&&n===a-2||(r.DownLeft=new L(W(c+1,a-1,c+2,a-2)),A(e,c,a,c+2,a-2,i,r.DownLeft)))}catch(s){}try{i.includes(e[c+1][a+1])&&(5!==e[c+2][a+2]&&6!==e[c+2][a+2]||t===c+2&&n===a+2||(r.DownRight=new L(W(c+1,a+1,c+2,a+2)),A(e,c,a,c+2,a+2,i,r.DownRight)))}catch(l){}try{i.includes(e[c-1][a-1])&&(5!==e[c-2][a-2]&&6!==e[c-2][a-2]||t===c-2&&n===a-2||(r.UpLeft=new L(W(c-1,a-1,c-2,a-2)),A(e,c,a,c-2,a-2,i,r.UpLeft)))}catch(h){}try{i.includes(e[c-1][a+1])&&(5!==e[c-2][a+2]&&6!==e[c-2][a+2]||t===c-2&&n===a+2||(r.UpRight=new L(W(c-1,a+1,c-2,a+2)),A(e,c,a,c-2,a+2,i,r.UpRight)))}catch(o){}return r}function q(e){var t=function(e){for(var t=[],n=0;n<e.length;n++)for(var c=0;c<e[n].length;c++){var a=e[n][c];if(2===a){var i=G(e,n,c,[1],new L({currentHeight:n,currentWidth:c}));null==i.Left&&null==i.Right||L.treeToArray(i).forEach((function(e){t.push(e)}))}else if(4===a){var r=A(e,n,c,n,c,[1,3],new U({currentHeight:n,currentWidth:c}));null==r.DownLeft&&null==r.DownRight&&null==r.UpLeft&&null==r.UpRight||U.kingTreeToArray(r).forEach((function(e){t.push(e)}))}}return t}(e);if(0!==t.length){for(var n=t[Math.floor(Math.random()*t.length)],c=[],a=1;a<n.length;a++){var i=n[a];c.push({height:i.takeHeight,width:i.takeWidth})}return{currentHeight:n[0].currentHeight,currentWidth:n[0].currentWidth,nextHeight:n[n.length-1].nextHeight,nextWidth:n[n.length-1].nextWidth,take:!0,takes:c}}var r=function(e){for(var t=[],n=0;n<e.length;n++)for(var c=0;c<e[n].length;c++){var a=e[n][c];2===a?(H(e,n,c)&&t.push(I(n,c,n+1,c-1)),E(e,n,c)&&t.push(I(n,c,n+1,c+1))):4===a&&(H(e,n,c)&&t.push(I(n,c,n+1,c-1)),E(e,n,c)&&t.push(I(n,c,n+1,c+1)),D(e,n,c)&&t.push(I(n,c,n-1,c-1)),V(e,n,c)&&t.push(I(n,c,n-1,c+1)))}return t}(e);if(0!==r.length)return r[Math.floor(Math.random()*r.length)]}function B(e){var t=Object(a.useState)([[2,0,2,0,2,0,2,0],[0,2,0,2,0,2,0,2],[2,0,2,0,2,0,2,0],[0,5,0,5,0,5,0,5],[5,0,5,0,5,0,5,0],[0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0],[0,1,0,1,0,1,0,1]]),n=Object(l.a)(t,2),i=n[0],r=n[1],s=Object(a.useState)(null),h=Object(l.a)(s,2),o=h[0],u=h[1],d=Object(a.useState)(null),b=Object(l.a)(d,2),f=b[0],m=b[1],y=Object(a.useState)(!0),v=Object(l.a)(y,2),R=v[0],C=v[1],P=R?"Show player tips":"Hide player tips",N=Object(a.useState)(F()),S=Object(l.a)(N,2),M=S[0],L=S[1],U=Object(a.useState)(!1),D=Object(l.a)(U,2),V=D[0],H=D[1],E=Object(a.useState)(null),I=Object(l.a)(E,2),W=I[0],G=I[1],A=Object(a.useState)([]),B=Object(l.a)(A,2),K=B[0],J=B[1];function F(){return i.map((function(e,t){var n=t;return Object(c.jsx)("tr",{children:e.map((function(e,t){return Object(c.jsx)("td",{className:"p-0",children:Object(c.jsx)(g,{state:e,y:n,x:t,setSquareToMoveTo:m,setCounterToMove:u})},n+t)}))},n)}))}function Y(){i[o.height][o.width]=5,i[f.height][f.width]=o.state,Q(),r(i),L(F()),e.setTurn(!1)}function z(t,n){i[o.height][o.width]=5,i[f.height][f.width]=o.state,2!==i[t][n]&&4!==i[t][n]||e.setPlayer2Counter(e.player2Counter+1),i[t][n]=5,Q(),r(i),L(F()),e.setTurn(!1)}function Q(){1===o.state&&0===f.height&&(i[f.height][f.width]=3)}function X(){for(var e=0;e<i.length;e++)for(var t=0;t<i[e].length;t++)6===i[e][t]&&(i[e][t]=5);r(i),L(F())}function Z(e){try{return i[f.height-1][f.width-1]===e&&(5===i[f.height-2][f.width-2]||6===i[f.height-2][f.width-2])||i[f.height-1][f.width+1]===e&&(5===i[f.height-2][f.width+2]||6===i[f.height-2][f.width+2])}catch(t){return!1}}function $(e){try{return i[f.height+1][f.width-1]===e&&(5===i[f.height+2][f.width-2]||6===i[f.height+2][f.width-2])||i[f.height+1][f.width+1]===e&&(5===i[f.height+2][f.width+2]||6===i[f.height+2][f.width+2])}catch(t){return!1}}function _(){for(var t=[],n=0;n<i.length;n++)t[n]=i[n].slice();J((function(n){return[].concat(Object(j.a)(n),[{turn:e.turn,board:t}])}))}function ee(e){for(var t=0,n=0;n<i.length;n++)for(var c=0;c<i[n].length;c++)i[n][c]!==e&&i[n][c]!==e+2||t++;return t}function te(){setTimeout((function(){var t=q(i);if(null!==t&&t!=={}&&void 0!==t){t.take&&(t.takes.forEach((function(e){i[e.height][e.width]=5})),e.setPlayer1Counter(e.player1Counter+t.takes.length));var n=i[t.currentHeight][t.currentWidth];i[t.currentHeight][t.currentWidth]=5,i[t.nextHeight][t.nextWidth]=n,7===t.nextHeight&&(i[t.nextHeight][t.nextWidth]=4),r(i),L(F()),e.setTurn(!0)}}),500)}return Object(a.useEffect)((function(){!function(){var t=k(i,1).concat(k(i,3)),n=k(i,2).concat(k(i,4));0===t.length&&0===n.length?(e.setResultsModalTitle("Tied game"),e.setResultsModalMessage("No player can move. Therefore the game ends in a tie. I hope you had fun playing."),e.setShowResultModal(!0)):0===t.length?(e.setResultsModalTitle("Player 2 wins"),e.setResultsModalMessage("Player 1 can no longer move. Player 2 wins. I hope you had fun playing."),e.setShowResultModal(!0)):0===n.length&&(e.setResultsModalTitle("Player 1 wins"),e.setResultsModalMessage("Player 2 can no longer move. Player 1 wins. I hope you had fun playing."),e.setShowResultModal(!0))}();var t,n=!0,c=!1;if(e.turn&&null!=o&&null!=f){if(1===o.state){var a=function(e,t){if(o.height+e===f.height&&(o.width-2===f.width||o.width+2===f.width)){var n=(f.height+o.height)/2,c=(f.width+o.width)/2;if(i[n][c]===t)return{result:!0,height:n,width:c}}return{result:!1}}(-2,2);a.result?(_(),z(a.height,a.width),c=!0,Z(2)&&(n=!1,H(!0))):(t=-1,o.height+t!==f.height||o.width-1!==f.width&&o.width+1!==f.width||(_(),Y(),c=!0))}else if(3===o.state)if(o.height-1===f.height||o.height+1===f.height)o.width-1!==f.width&&o.width+1!==f.width||(_(),Y(),c=!0);else if((o.height-2===f.height||o.height+2===f.height)&&(o.width-2===f.width||o.width+2===f.width)){var r=(f.height+o.height)/2,s=(f.width+o.width)/2;2!==i[r][s]&&4!==i[r][s]||(_(),z(r,s),c=!0,(Z(2)||Z(4)||$(2)||$(4))&&(n=!1,H(!0)))}X(),C(!0),u(null),m(null),n&&c?te():!1===c&&alert("Invalid move")}}),[f,o,i]),Object(a.useEffect)((function(){W?(e.setTurn(!0),G(null)):!1===W&&(te(),G(null))}),[W,e]),Object(c.jsxs)(T.a,{fluid:!0,children:[Object(c.jsx)("div",{className:"d-flex justify-content-center mb-3",children:Object(c.jsx)("h2",{children:"PC Mode"})}),Object(c.jsxs)(x.a,{className:"d-flex justify-content-center",children:[Object(c.jsx)(w.a,{className:"ml-2 mr-2 mb-4",children:Object(c.jsx)(p.a,{onClick:function(){e.turn&&(R?(!0===e.turn&&k(i,1).concat(k(i,3)).forEach((function(e){i[e.height][e.width]=6})),C(!1)):(X(),C(!0)),r(i),L(F()))},children:P})}),Object(c.jsx)(w.a,{className:"ml-2 mr-2 mb-4",children:Object(c.jsx)(p.a,{onClick:function(){if(0!==K.length){!1===R&&C(!0);for(var t=K[K.length-1],n=0;n<i.length;n++)for(var c=0;c<i[n].length;c++)6===t.board[n][c]?i[n][c]=5:i[n][c]!==t.board[n][c]&&(i[n][c]=t.board[n][c]);e.setTurn(t.turn),K.pop();var a=12-ee(1);e.setPlayer1Counter(a);var r=12-ee(2);e.setPlayer2Counter(r),L(F())}},children:"Undo"})})]}),Object(c.jsx)(O,{show:V,update:H,setJumpModalValue:G}),Object(c.jsx)("div",{className:"d-flex justify-content-center",children:Object(c.jsx)("table",{className:"gameBorder",children:Object(c.jsx)("tbody",{className:"border border-dark",children:M})})})]})}function K(e){return Object(c.jsxs)("div",{children:[Object(c.jsxs)(h.a,{className:"p-3",children:[Object(c.jsx)("div",{className:"circle red center"+(!0===e.turn?" yellow":"")}),Object(c.jsx)("h3",{className:"p-4",children:"Player 1"})]}),Object(c.jsx)("br",{}),Object(c.jsxs)(h.a,{className:"p-3",children:[Object(c.jsx)("div",{className:"circle blue center"+(!1===e.turn?" yellow":"")}),Object(c.jsx)("h3",{className:"p-4",children:"Player 2"})]})]})}function J(e){return Object(c.jsxs)("div",{children:[Object(c.jsxs)(h.a,{className:"p-3",children:[Object(c.jsx)("div",{className:"circle red center"}),Object(c.jsx)("h3",{className:"p-4",children:"Single"})]}),Object(c.jsx)("br",{}),Object(c.jsxs)(h.a,{className:"p-3",children:[Object(c.jsx)("div",{className:"circle red center",children:"K"}),Object(c.jsx)("h3",{className:"p-4",children:"King"})]})]})}function F(e){return Object(c.jsxs)("div",{children:[Object(c.jsxs)(h.a,{className:"p-3",children:[Object(c.jsx)("div",{className:"circle red center"}),Object(c.jsx)("h3",{className:"m-0 p-4",children:e.player1Counter})]}),Object(c.jsx)("br",{}),Object(c.jsxs)(h.a,{className:"p-3",children:[Object(c.jsx)("div",{className:"circle blue center"}),Object(c.jsx)("h3",{className:"p-4",children:e.player2Counter})]})]})}function Y(e){var t=function(){return e.update(!1)};return Object(c.jsx)("div",{children:Object(c.jsxs)(f.a,{show:e.show,onHide:t,children:[Object(c.jsx)(f.a.Header,{closeButton:!0,children:Object(c.jsx)(f.a.Title,{children:e.title})}),Object(c.jsx)(f.a.Body,{children:e.message}),Object(c.jsxs)(f.a.Footer,{children:[Object(c.jsx)(p.a,{variant:"danger",onClick:t,children:"Close"}),Object(c.jsx)(p.a,{variant:"success",onClick:function(){return window.location.reload()},children:"Restart"})]})]})})}var z=i.a.createContext();function Q(e){var t=Object(a.useState)(null),n=Object(l.a)(t,2),i=n[0],r=n[1];return Object(c.jsx)(z.Provider,{value:{pcOr2Player:i,handlePcOr2PlayerChange:function(e){r(e.target.value)}},children:e.children})}function X(e){var t=Object(a.useState)(0),n=Object(l.a)(t,2),i=n[0],r=n[1],s=Object(a.useState)(0),u=Object(l.a)(s,2),j=u[0],b=u[1],g=Object(a.useState)(!1),f=Object(l.a)(g,2),p=f[0],O=f[1],x=Object(a.useState)(""),w=Object(l.a)(x,2),m=w[0],y=w[1],v=Object(a.useState)(""),R=Object(l.a)(v,2),C=R[0],P=R[1],k=Object(a.useContext)(z),T=Object(a.useState)(!0),S=Object(l.a)(T,2),M=S[0],L=S[1];return Object(a.useEffect)((function(){12===i?(y("Player 2 wins"),P("Well done on finishing the game of draughts. I hope you had fun playing."),O(!0)):12===j&&(y("Player 1 wins"),P("Well done on finishing the game of draughts. I hope you had fun playing."),O(!0))}),[i,j]),Object(c.jsxs)(h.a,{children:[Object(c.jsx)(Y,{show:p,update:O,title:m,message:C}),Object(c.jsx)(o.a,{xl:"1"}),Object(c.jsxs)(o.a,{xl:"7",children:["true"===k.pcOr2Player?Object(c.jsx)(B,{player1Counter:i,setPlayer1Counter:r,player2Counter:j,setPlayer2Counter:b,turn:M,setTurn:L,setResultsModalTitle:y,setShowResultModal:O,setResultsModalMessage:P}):Object(c.jsx)(N,{player1Counter:i,setPlayer1Counter:r,player2Counter:j,setPlayer2Counter:b,turn:M,setTurn:L,setResultsModalTitle:y,setShowResultModal:O,setResultsModalMessage:P}),Object(c.jsx)("br",{})]}),Object(c.jsxs)(o.a,{xl:"3",children:[Object(c.jsx)(d,{title:"Players",innerComponent:Object(c.jsx)(K,{turn:M})}),Object(c.jsx)("br",{}),Object(c.jsx)(d,{title:"Pieces",innerComponent:Object(c.jsx)(J,{})}),Object(c.jsx)("br",{}),Object(c.jsx)(d,{title:"Pieces Taken",innerComponent:Object(c.jsx)(F,{player1Counter:i,player2Counter:j})}),Object(c.jsx)("br",{})]}),Object(c.jsx)(o.a,{xl:"1"})]})}n(62);function Z(){return Object(c.jsx)(T.a,{fluid:!0,children:Object(c.jsxs)(h.a,{children:[Object(c.jsx)(o.a,{xl:"1"}),Object(c.jsxs)(o.a,{xl:"10",children:[Object(c.jsx)("div",{children:Object(c.jsx)("h1",{children:"How To Play Draughts"})}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"Goal"}),Object(c.jsx)("p",{children:"The goal of the game of draughts is to take all of the opponent's pieces."})]}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"Summary"}),Object(c.jsx)("p",{children:"Draughts is a simple game with limited movement. There are two types of pieces in the game. Singles and kings, they can be differentiated with kings having a 'K' in the centre of the game piece. Singles can only move towards the opponents end of the board whereas kings can move both up and down the board. The game starts with only single pieces in play. Kings can be achieved by a player moving a piece to the far end of the board."}),Object(c.jsx)("p",{children:"Players take it in turn to move a single game piece. Pieces can only move in a diagonal direction by one square therefore not white square can be used. Only one piece can occupy a square. Players can take an opponents piece by jumping a character if the square diagonally behind the piece is available."})]}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"Rules"}),Object(c.jsxs)("ul",{children:[Object(c.jsx)("li",{children:"Player play the game in turns"}),Object(c.jsx)("li",{children:"Players can only move one piece during a turn"}),Object(c.jsx)("li",{children:"Kings are automatically created"}),Object(c.jsx)("li",{children:"Piece can only move diagonally"}),Object(c.jsx)("li",{children:"Singles only move towards to the opponent"}),Object(c.jsx)("li",{children:"Kings can only move up and down"}),Object(c.jsx)("li",{children:"Pieces can only take a character if the space diagonally behind it is free"})]})]}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"How to play"}),Object(c.jsx)("p",{children:"A yellow ring will appear around the piece to identify whos turn it is in the players section."}),Object(c.jsx)("p",{children:"The pieces taken section will keep count of the pieces taken, once a player gets to 12 they lose."}),Object(c.jsx)("p",{children:"To move a piece click on the piece you want to move and the square you want to move it to. The game will do the rest and make you the move is valid."}),Object(c.jsx)("p",{children:"The game will automatically king piece."})]})]}),Object(c.jsx)(o.a,{xl:"1"})]})})}var $=n(50);function _(e){var t=e.features.map((function(e,t){return Object(c.jsx)("li",{children:e},t)}));return Object(c.jsx)(u.a,{children:Object(c.jsxs)(u.a.Body,{children:[Object(c.jsx)(u.a.Header,{children:Object(c.jsx)("h3",{children:e.title})}),Object(c.jsxs)(u.a.Text,{children:[Object(c.jsx)("h5",{children:"Features"}),Object(c.jsx)("ul",{children:t})]}),Object(c.jsx)($.a,{variant:e.colour,children:e.status})]})})}function ee(){return Object(c.jsx)(T.a,{fluid:!0,children:Object(c.jsxs)(h.a,{children:[Object(c.jsx)(o.a,{xl:"1"}),Object(c.jsxs)(o.a,{xl:"10",children:[Object(c.jsxs)("div",{children:[Object(c.jsx)("h1",{children:"About"}),Object(c.jsx)("p",{children:"This game was made in loving memory of my grandad, Ernest Rumbol. My grandad taught me this game many years ago. Over the years we have played thousands of games together. As I got older and understood the game more, the more games I won. However, grandad still loved playing even when he wiped the board clean because he lost the game after the first move. We played with many different rule sets, his favourite was forcing users to take a piece if available, I thought the game was more tactical if you didn't. I hope that people play this game with as much fun as we did."})]}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"Technical information"}),Object(c.jsxs)("p",{children:["Below lets the tools used to build this web application. You can find the source code at the ",Object(c.jsx)("a",{href:"https://github.com/OllieRumbol/draughtsgame",children:"Git Repo"})]}),Object(c.jsxs)("ul",{children:[Object(c.jsx)("li",{children:Object(c.jsx)("a",{href:"https://reactjs.org/",children:"React with hooks"})}),Object(c.jsx)("li",{children:Object(c.jsx)("a",{href:"https://react-bootstrap.github.io/",children:"React bootstrap"})}),Object(c.jsx)("li",{children:Object(c.jsx)("a",{href:"https://reactrouter.com/web/guides/quick-start",children:"React router"})}),Object(c.jsx)("li",{children:Object(c.jsx)("a",{href:"https://pages.github.com/",children:"Git pages (for hosting)"})}),Object(c.jsx)("li",{children:Object(c.jsx)("a",{href:"https://testing-library.com/docs/react-testing-library/intro/",children:"React testing"})})]})]}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{children:"Project Plan"}),Object(c.jsxs)("div",{className:"card-columns",children:[Object(c.jsx)(_,{title:"Draughts Game Phase 1 Epic",colour:"success",features:["React Project Setup","Board setup","Counter setup","UI design","Move counter","Take counter","Game end","King me","Turns"],status:"Complete"}),Object(c.jsx)(_,{title:"React Router Epic",colour:"success",features:["Setup","Refactor","Production changes"],status:"Complete"}),Object(c.jsx)(_,{title:"Pages Epic",colour:"success",features:["How to play","About"],status:"Complete"}),Object(c.jsx)(_,{title:"CI/CD and Unit Tests Epic",colour:"warning",features:["Create basic pipeline in yaml","Setup testing environment and add to pipeline","Unit test components","Unit test web app logic"],status:"In progress"}),Object(c.jsx)(_,{title:"Player tips Epic",colour:"success",features:["UI changes to display user tips","Logic to work out where a player can move","Logic to work out where a player can take another counter"],status:"Complete"}),Object(c.jsx)(_,{title:"Draughts Game Phase 2 Epic",colour:"success",features:["Double jumps","Game over - no one can move","Restart","Undo","CSS for selecting a counter"],status:"Complete"}),Object(c.jsx)(_,{title:"Automated 2nd Player Phase 1 Epic",colour:"success",features:["Game setup page, 2 player or VS PC. Along with other settings","Web app logic for PC to decide next move (random logic)","Render PC move on page"],status:"Complete"}),Object(c.jsx)(_,{title:"Automated 2nd Player Phase 2 Epic",colour:"danger",features:["Use some kind of genetic search algorithm to find best move"],status:"Not started"}),Object(c.jsx)(_,{title:"Mobile responsive UI Epic",colour:"danger",features:["Game setup page is mobile responsive","Game board page is mobile responsive","How to play page is mobile responsive","About page is mobile responsive"],status:"Not started"}),Object(c.jsx)(_,{title:"Draughts Game Phase 3 Epic",colour:"danger",features:["Setting to decide who goes first","Update how to play"],status:"Not started"}),Object(c.jsx)(_,{title:"Support Epic",colour:"danger",features:["Game tips results in no possible moves (26/01/21)","Player tips not showing all possible moves for a king (31/01/21)","Player tips infinite loop (1/2/21)","Double jumps and undo (2/2/21)","Undo is hiding player tips when no moves have been made (6/2/21)"],status:"Paused due to no further work"}),Object(c.jsx)(_,{title:"Technical Debt Epic Epic",colour:"danger",features:["Refactor main use effect logic (28/01/21)"],status:"Paused due to no further work"})]})]}),Object(c.jsx)("br",{})]}),Object(c.jsx)(o.a,{xl:"1"})]})})}n(63);function te(e){var t=Object(a.useContext)(z);return Object(c.jsx)(T.a,{fluid:!0,children:Object(c.jsxs)(h.a,{children:[Object(c.jsx)(o.a,{xl:"1"}),Object(c.jsxs)(o.a,{xl:"10",children:[Object(c.jsx)("div",{children:Object(c.jsx)("h1",{children:"Game settings"})}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{className:"pb-2",children:"Opponent"}),Object(c.jsx)("div",{children:Object(c.jsxs)("label",{className:"radioContainer",children:[Object(c.jsx)("div",{className:"topper",children:"PC"}),Object(c.jsx)("input",{type:"radio",name:"radio",className:"hide",value:!0,onChange:t.handlePcOr2PlayerChange}),Object(c.jsx)("span",{className:"checkMark"})]})}),Object(c.jsx)("div",{children:Object(c.jsxs)("label",{className:"radioContainer",children:[Object(c.jsx)("div",{className:"topper",children:"2 Player"}),Object(c.jsx)("input",{type:"radio",name:"radio",value:!1,onChange:t.handlePcOr2PlayerChange}),Object(c.jsx)("span",{className:"checkMark"})]})})]}),Object(c.jsx)("div",{children:Object(c.jsx)(p.a,{variant:"success",onClick:function(){null!=t.pcOr2Player&&e.setHasSetGameSettings(!0)},children:"Submit"})})]}),Object(c.jsx)(o.a,{xl:"1"})]})})}var ne=n(32),ce=n(8),ae=n(49);n(64);function ie(){var e=Object(a.useState)(!1),t=Object(l.a)(e,2),n=t[0],i=t[1];return Object(c.jsx)(Q,{children:Object(c.jsx)(ne.a,{children:Object(c.jsxs)(T.a,{fluid:!0,children:[Object(c.jsx)(ae.a,{fluid:!0,children:Object(c.jsxs)(T.a,{children:[Object(c.jsx)("h1",{"data-testid":"title",className:"display-1 font-weight-bold",children:"Draughts Game"}),Object(c.jsx)("h4",{children:"A draughts game built in react js"}),Object(c.jsx)("hr",{className:"my-4"}),Object(c.jsxs)(x.a,{children:[Object(c.jsx)(ne.b,{to:"/",children:Object(c.jsx)(w.a,{className:"mr-2",children:Object(c.jsx)(p.a,{"data-testid":"link",variant:"primary",children:"Home"})})}),Object(c.jsx)(ne.b,{to:"/howtoplay",children:Object(c.jsx)(w.a,{className:"mr-2",children:Object(c.jsx)(p.a,{"data-testid":"link",variant:"primary",children:"How to play"})})}),Object(c.jsx)(ne.b,{to:"/about",children:Object(c.jsx)(w.a,{className:"mr-2",children:Object(c.jsx)(p.a,{"data-testid":"link",variant:"primary",children:"About"})})})]})]})}),Object(c.jsx)("main",{children:Object(c.jsxs)(ce.c,{children:[Object(c.jsx)(ce.a,{path:"/",exact:!0,component:function(){return n?Object(c.jsx)(X,{}):Object(c.jsx)(te,{setHasSetGameSettings:i})}}),Object(c.jsx)(ce.a,{path:"/howtoplay",exact:!0,component:function(){return Object(c.jsx)(Z,{})}}),Object(c.jsx)(ce.a,{path:"/about",exact:!0,component:function(){return Object(c.jsx)(ee,{})}})]})})]})})})}s.a.render(Object(c.jsx)(ie,{}),document.getElementById("root"))}},[[68,1,2]]]);
//# sourceMappingURL=main.ac61741d.chunk.js.map