(this.webpackJsonpdraughtsgame=this.webpackJsonpdraughtsgame||[]).push([[0],{33:function(e,t,n){},56:function(e,t,n){},57:function(e,t,n){},61:function(e,t,n){},62:function(e,t,n){},63:function(e,t,n){},64:function(e,t,n){},68:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n(1),i=n.n(c),r=n(24),s=n.n(r),l=(n(56),n(6)),h=n(12),o=n(13),u=n(22);n(25);function d(e){return Object(a.jsx)("div",{children:Object(a.jsxs)(u.a,{children:[Object(a.jsx)(u.a.Header,{children:Object(a.jsx)("h2",{children:e.title})}),Object(a.jsx)(u.a.Body,{children:e.innerComponent})]})})}var j=n(38);n(33);function b(e){var t=function(){var e=Object(c.useRef)(null),t=Object(c.useState)(!1),n=Object(l.a)(t,2),a=n[0],i=n[1];function r(t){e.current&&e.current.contains(t.target)?i(!0):i(!1)}return Object(c.useEffect)((function(){return document.addEventListener("mousedown",r,!0),function(){document.removeEventListener("mousedown",r,!0)}}),[e]),{visible:a,ref:e}}(),n=t.visible,i=t.ref,r=n?"circle red center yellow":"circle red center",s=n?"circle blue center yellow":"circle blue center",h=e.state,o=e.y,u=e.x,d=e.setCounterToMove;function j(){d({state:h,height:o,width:u})}return 1===e.state?Object(a.jsx)("div",{ref:i,className:r,onClick:j}):2===e.state?Object(a.jsx)("div",{ref:i,className:s,onClick:j}):3===e.state?Object(a.jsx)("div",{ref:i,className:r,onClick:j,children:"K"}):4===e.state?Object(a.jsx)("div",{ref:i,className:s,onClick:j,children:"K"}):Object(a.jsx)("div",{})}n(57);function g(e){var t=e.state,n=6===t?"square tip":0!==t?"square black":"square",c=e.y,i=e.x,r=e.setSquareToMoveTo;return Object(a.jsx)("div",{className:n,onClick:function(){5!==t&&6!==t||r({height:c,width:i})},children:Object(a.jsx)(b,{state:t,y:c,x:i,setCounterToMove:e.setCounterToMove})})}var f=n(16),p=n(10);function O(e){var t=function(){return e.update(!1)};return Object(a.jsx)("div",{children:Object(a.jsxs)(f.a,{show:e.show,onHide:t,children:[Object(a.jsx)(f.a.Header,{closeButton:!0,children:Object(a.jsx)(f.a.Title,{children:"Would you like to take again?"})}),Object(a.jsx)(f.a.Body,{children:"In draughts players can jump multiple times to take multiple pieces from their opponent."}),Object(a.jsxs)(f.a.Footer,{children:[Object(a.jsx)(p.a,{variant:"primary",onClick:function(){e.setJumpModalValue(!0),t()},children:"Yes"}),Object(a.jsx)(p.a,{variant:"primary",onClick:function(){e.setJumpModalValue(!1),t()},children:"No"})]})]})})}var x=n(27),m=n(20),w=(n(61),[]);function y(e,t,n){try{5!==e[t-1][n-1]&&6!==e[t-1][n-1]||w.push({height:t-1,width:n-1})}catch(a){}try{5!==e[t-1][n+1]&&6!==e[t-1][n+1]||w.push({height:t-1,width:n+1})}catch(c){}}function v(e,t,n){try{5!==e[t+1][n-1]&&6!==e[t+1][n-1]||w.push({height:t+1,width:n-1})}catch(a){}try{5!==e[t+1][n+1]&&6!==e[t+1][n+1]||w.push({height:t+1,width:n+1})}catch(c){}}function R(e,t,n,a){try{a.includes(e[t-1][n-1])&&(5!==e[t-2][n-2]&&6!==e[t-2][n-2]||(w.push({height:t-2,width:n-2}),R(e,t-2,n-2,a)))}catch(c){}try{a.includes(e[t-1][n+1])&&(5!==e[t-2][n+2]&&6!==e[t-2][n+2]||(w.push({height:t-2,width:n+2}),R(e,t-2,n+2,a)))}catch(i){}}function C(e,t,n,a){try{a.includes(e[t+1][n-1])&&(5!==e[t+2][n-2]&&6!==e[t+2][n-2]||(w.push({height:t+2,width:n-2}),C(e,t+2,n-2,a)))}catch(c){}try{a.includes(e[t+1][n+1])&&(5!==e[t+2][n+2]&&6!==e[t+2][n+2]||(w.push({height:t+2,width:n+2}),C(e,t+2,n+2,a)))}catch(i){}}function P(e,t,n,a,c,i){try{i.includes(e[a+1][c-1])&&(5!==e[a+2][c-2]&&6!==e[a+2][c-2]||t===a+2&&n===c-2||(w.push({height:a+2,width:c-2}),P(e,a,c,a+2,c-2,i)))}catch(r){}try{i.includes(e[a+1][c+1])&&(5!==e[a+2][c+2]&&6!==e[a+2][c+2]||t===a+2&&n===c+2||(w.push({height:a+2,width:c+2}),P(e,a,c,a+2,c+2,i)))}catch(s){}try{i.includes(e[a-1][c-1])&&(5!==e[a-2][c-2]&&6!==e[a-2][c-2]||t===a-2&&n===c-2||(w.push({height:a-2,width:c-2}),P(e,a,c,a-2,c-2,i)))}catch(l){}try{i.includes(e[a-1][c+1])&&(5!==e[a-2][c+2]&&6!==e[a-2][c+2]||t===a-2&&n===c+2||(w.push({height:a-2,width:c+2}),P(e,a,c,a-2,c+2,i)))}catch(h){}}function k(e,t){w=[];for(var n=0;n<e.length;n++)for(var a=0;a<e[n].length;a++){var c=e[n][a];c===t&&(1===c?(y(e,n,a),R(e,n,a,[2])):2===c?(v(e,n,a),C(e,n,a,[1])):3===c?(y(e,n,a),v(e,n,a),P(e,n,a,n,a,[2,4])):4===c&&(y(e,n,a),v(e,n,a),P(e,n,a,n,a,[1,3])))}return function(e){var t=[];return e.forEach((function(e){if(0===t.length)t.push(e);else{var n=0;t.forEach((function(t){e.height===t.height&&e.width===t.width&&n++})),0===n&&t.push(e)}})),t}(w)}function N(e){var t=Object(c.useState)([[2,0,2,0,2,0,2,0],[0,2,0,2,0,2,0,2],[2,0,2,0,2,0,2,0],[0,5,0,5,0,5,0,5],[5,0,5,0,5,0,5,0],[0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0],[0,1,0,1,0,1,0,1]]),n=Object(l.a)(t,2),i=n[0],r=n[1],s=Object(c.useState)(null),h=Object(l.a)(s,2),o=h[0],u=h[1],d=Object(c.useState)(null),b=Object(l.a)(d,2),f=b[0],w=b[1],y=Object(c.useState)(!0),v=Object(l.a)(y,2),R=v[0],C=v[1],P=R?"Show player tips":"Hide player tips",N=Object(c.useState)(K()),T=Object(l.a)(N,2),S=T[0],M=T[1],L=Object(c.useState)(!1),U=Object(l.a)(L,2),D=U[0],V=U[1],H=Object(c.useState)(!1),E=Object(l.a)(H,2),I=E[0],W=E[1],A=Object(c.useState)([]),G=Object(l.a)(A,2),q=G[0],B=G[1];function K(){return i.map((function(e,t){var n=t;return Object(a.jsx)("tr",{children:e.map((function(e,t){return Object(a.jsx)("td",{className:"p-0",children:Object(a.jsx)(g,{state:e,y:n,x:t,setSquareToMoveTo:w,setCounterToMove:u})},n+t)}))},n)}))}function J(){i[o.height][o.width]=5,i[f.height][f.width]=o.state,Y(),r(i),M(K()),e.setTurn(!e.turn)}function F(t,n){i[o.height][o.width]=5,i[f.height][f.width]=o.state,1===i[t][n]||3===i[t][n]?e.setPlayer1Counter(e.player1Counter+1):2!==i[t][n]&&4!==i[t][n]||e.setPlayer2Counter(e.player2Counter+1),i[t][n]=5,Y(),r(i),M(K()),e.setTurn(!e.turn)}function Y(){1===o.state?0===f.height&&(i[f.height][f.width]=3):2===o.state&&7===f.height&&(i[f.height][f.width]=4)}function z(){for(var e=0;e<i.length;e++)for(var t=0;t<i[e].length;t++)6===i[e][t]&&(i[e][t]=5);r(i),M(K())}function Q(e){try{return i[f.height-1][f.width-1]===e&&(5===i[f.height-2][f.width-2]||6===i[f.height-2][f.width-2])||i[f.height-1][f.width+1]===e&&(5===i[f.height-2][f.width+2]||6===i[f.height-2][f.width+2])}catch(t){return!1}}function X(e){try{return i[f.height+1][f.width-1]===e&&(5===i[f.height+2][f.width-2]||6===i[f.height+2][f.width-2])||i[f.height+1][f.width+1]===e&&(5===i[f.height+2][f.width+2]||6===i[f.height+2][f.width+2])}catch(t){return!1}}function Z(e){return o.height+e===f.height&&(o.width-1===f.width||o.width+1===f.width)}function $(e,t){if(o.height+e===f.height&&(o.width-2===f.width||o.width+2===f.width)){var n=(f.height+o.height)/2,a=(f.width+o.width)/2;if(i[n][a]===t)return{result:!0,height:n,width:a}}return{result:!1}}function _(){for(var t=[],n=0;n<i.length;n++)t[n]=i[n].slice();B((function(n){return[].concat(Object(j.a)(n),[{turn:e.turn,board:t}])}))}function ee(e){for(var t=0,n=0;n<i.length;n++)for(var a=0;a<i[n].length;a++)i[n][a]!==e&&i[n][a]!==e+2||t++;return t}return Object(c.useEffect)((function(){if(function(){var t=k(i,1).concat(k(i,3)),n=k(i,2).concat(k(i,4));0===t.length&&0===n.length?(e.setResultsModalTitle("Tied game"),e.setResultsModalMessage("No player can move. Therefore the game ends in a tie. I hope you had fun playing."),e.setShowResultModal(!0)):0===t.length?(e.setResultsModalTitle("Player 2 wins"),e.setResultsModalMessage("Player 1 can no longer move. Player 2 wins. I hope you had fun playing."),e.setShowResultModal(!0)):0===n.length&&(e.setResultsModalTitle("Player 1 wins"),e.setResultsModalMessage("Player 2 can no longer move. Player 1 wins. I hope you had fun playing."),e.setShowResultModal(!0))}(),null!=o&&null!=f){if(!0===e.turn&&1===o.state){var t=$(-2,2);t.result?(_(),F(t.height,t.width),Q(2)&&V(!0)):Z(-1)&&(_(),J())}if(!1===e.turn&&2===o.state){var n=$(2,1);n.result?(_(),F(n.height,n.width),Q(1)&&V(!0)):Z(1)&&(_(),J())}if(3===o.state||4===o.state)if(o.height-1===f.height||o.height+1===f.height)o.width-1!==f.width&&o.width+1!==f.width||(3===o.state&&!0===e.turn||4===o.state&&!1===e.turn)&&(_(),J());else if((o.height-2===f.height||o.height+2===f.height)&&(o.width-2===f.width||o.width+2===f.width)){var a=(f.height+o.height)/2,c=(f.width+o.width)/2;!0===e.turn?3!==o.state||2!==i[a][c]&&4!==i[a][c]||(_(),F(a,c),(Q(2)||Q(4)||X(2)||X(4))&&V(!0)):!1===e.turn&&(4!==o.state||1!==i[a][c]&&3!==i[a][c]||(_(),F(a,c),(Q(1)||Q(3)||X(1)||X(3))&&V(!0)))}z(),C(!0),u(null),w(null)}}),[f,o,i]),Object(c.useEffect)((function(){I&&(e.setTurn(!e.turn),W(!1))}),[I,e]),Object(a.jsxs)("div",{className:"container fluid",children:[Object(a.jsx)("div",{className:"d-flex justify-content-center mb-3",children:Object(a.jsx)("h2",{children:"2 Player Mode"})}),Object(a.jsxs)(x.a,{className:"d-flex justify-content-center",children:[Object(a.jsx)(m.a,{className:"ml-2 mr-2 mb-4",children:Object(a.jsx)(p.a,{onClick:function(){R?(!0===e.turn?k(i,1).concat(k(i,3)).forEach((function(e){i[e.height][e.width]=6})):!1===e.turn&&k(i,2).concat(k(i,4)).forEach((function(e){i[e.height][e.width]=6})),C(!1)):(z(),C(!0)),r(i),M(K())},children:P})}),Object(a.jsx)(m.a,{className:"ml-2 mr-2 mb-4",children:Object(a.jsx)(p.a,{onClick:function(){if(0!==q.length){!1===R&&C(!0);for(var t=q[q.length-1],n=0;n<i.length;n++)for(var a=0;a<i[n].length;a++)6===t.board[n][a]?i[n][a]=5:i[n][a]!==t.board[n][a]&&(i[n][a]=t.board[n][a]);e.setTurn(t.turn),q.pop();var c=12-ee(1);e.setPlayer1Counter(c);var r=12-ee(2);e.setPlayer2Counter(r),M(K())}},children:"Undo"})})]}),Object(a.jsx)(O,{show:D,update:V,setJumpModalValue:W}),Object(a.jsx)("div",{className:"d-flex justify-content-center",children:Object(a.jsx)("table",{className:"gameBorder",children:Object(a.jsx)("tbody",{className:"border border-dark",children:S})})})]})}var T=n(19),S=n(43),M=n(44),L=function(){function e(t){Object(S.a)(this,e),this.Value=t,this.Left=null,this.Right=null}return Object(M.a)(e,null,[{key:"treeToArray",value:function(e){var t=[];return function e(n,a){return null!=n.Left&&null!=n.Right?e(n.Left,a.concat(n.Value))+e(n.Right,a.concat(n.Value)):null!=n.Left?e(n.Left,a.concat(n.Value)):null!=n.Right?e(n.Right,a.concat(n.Value)):void t.push(a.concat(n.Value))}(e,[]),t}}]),e}(),U=function(){function e(t){Object(S.a)(this,e),this.Value=t,this.DownLeft=null,this.DownRight=null,this.UpLeft=null,this.UpRight=null}return Object(M.a)(e,null,[{key:"kingTreeToArray",value:function(e){var t=[];return function e(n,a){return null!=n.DownLeft&&null!=n.DownRight&&null!=n.UpLeft&&null!=n.UpRight?e(n.DownLeft,a.concat(n.Value))+e(n.DownRight,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value)+e(n.UpRight,a.concat(n.Value))):null!=n.DownLeft&&null!=n.DownRight&&null!=n.UpLeft?e(n.DownLeft,a.concat(n.Value))+e(n.DownRight,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value)):null!=n.DownLeft&&null!=n.DownRight&&null!=n.UpRight?e(n.DownLeft,a.concat(n.Value))+e(n.DownRight,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.DownLeft&&null!=n.UpLeft&&null!=n.UpRight?e(n.DownLeft,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.DownRight&&null!=n.UpLeft&&null!=n.UpRight?e(n.DownRight,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.DownLeft&&null!=n.DownRight?e(n.DownLeft,a.concat(n.Value))+e(n.DownRight,a.concat(n.Value)):null!=n.DownLeft&&null!=n.UpLeft?e(n.DownLeft,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value)):null!=n.DownLeft&&null!=n.UpRight?e(n.DownLeft,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.DownRight&&null!=n.UpLeft?e(n.DownRight,a.concat(n.Value))+e(n.UpLeft,a.concat(n.Value)):null!=n.DownLeft&&null!=n.UpRight?e(n.DownLeft,a.concat(n.Value))+e(n.UpRight,a.concat(n.Value)):null!=n.UpLeft&&null!=n.UpRight?e(n.UpLeft,a.concat(n.Value)+e(n.UpRight,a.concat(n.Value))):null!=n.DownLeft?e(n.DownLeft,a.concat(n.Value)):null!=n.DownRight?e(n.DownRight,a.concat(n.Value)):null!=n.UpLeft?e(n.UpLeft,a.concat(n.Value)):null!=n.UpRight?e(n.UpRight,a.concat(n.Value)):void t.push(a.concat(n.Value))}(e,[]),t}}]),e}();function D(e,t,n){try{return 5===e[t-1][n-1]||6===e[t-1][n-1]}catch(a){return!1}}function V(e,t,n){try{return 5===e[t-1][n+1]||6===e[t-1][n+1]}catch(a){return!1}}function H(e,t,n){try{return 5===e[t+1][n-1]||6===e[t+1][n-1]}catch(a){return!1}}function E(e,t,n){try{return 5===e[t+1][n+1]||6===e[t+1][n+1]}catch(a){return!1}}function I(e,t,n,a){return{currentHeight:e,currentWidth:t,nextHeight:n,nextWidth:a,take:!1}}function W(e,t,n,a){return{takeHeight:e,takeWidth:t,nextHeight:n,nextWidth:a}}function A(e,t,n,a,c){try{a.includes(e[t+1][n-1])&&(5!==e[t+2][n-2]&&6!==e[t+2][n-2]||(c.Left=new L(W(t+1,n-1,t+2,n-2)),A(e,t+2,n-2,a,c.Left)))}catch(i){}try{a.includes(e[t+1][n+1])&&(5!==e[t+2][n+2]&&6!==e[t+2][n+2]||(c.Right=new L(W(t+1,n+1,t+2,n+2)),A(e,t+2,n+2,a,c.Right)))}catch(r){}return c}function G(e,t,n,a,c,i,r){try{i.includes(e[a+1][c-1])&&(5!==e[a+2][c-2]&&6!==e[a+2][c-2]||t===a+2&&n===c-2||(r.DownLeft=new L(W(a+1,c-1,a+2,c-2)),G(e,a,c,a+2,c-2,i,r.DownLeft)))}catch(s){}try{i.includes(e[a+1][c+1])&&(5!==e[a+2][c+2]&&6!==e[a+2][c+2]||t===a+2&&n===c+2||(r.DownRight=new L(W(a+1,c+1,a+2,c+2)),G(e,a,c,a+2,c+2,i,r.DownRight)))}catch(l){}try{i.includes(e[a-1][c-1])&&(5!==e[a-2][c-2]&&6!==e[a-2][c-2]||t===a-2&&n===c-2||(r.UpLeft=new L(W(a-1,c-1,a-2,c-2)),G(e,a,c,a-2,c-2,i,r.UpLeft)))}catch(h){}try{i.includes(e[a-1][c+1])&&(5!==e[a-2][c+2]&&6!==e[a-2][c+2]||t===a-2&&n===c+2||(r.UpRight=new L(W(a-1,c+1,a-2,c+2)),G(e,a,c,a-2,c+2,i,r.UpRight)))}catch(o){}return r}function q(e){var t=function(e){for(var t=[],n=0;n<e.length;n++)for(var a=0;a<e[n].length;a++){var c=e[n][a];if(2===c){var i=A(e,n,a,[1],new L({currentHeight:n,currentWidth:a}));null==i.Left&&null==i.Right||L.treeToArray(i).forEach((function(e){t.push(e)}))}else if(4===c){var r=G(e,n,a,n,a,[1,3],new U({currentHeight:n,currentWidth:a}));null==r.DownLeft&&null==r.DownRight&&null==r.UpLeft&&null==r.UpRight||U.kingTreeToArray(r).forEach((function(e){t.push(e)}))}}return t}(e);if(0!==t.length){for(var n=t[Math.floor(Math.random()*t.length)],a=[],c=1;c<n.length;c++){var i=n[c];a.push({height:i.takeHeight,width:i.takeWidth})}return{currentHeight:n[0].currentHeight,currentWidth:n[0].currentWidth,nextHeight:n[n.length-1].nextHeight,nextWidth:n[n.length-1].nextWidth,take:!0,takes:a}}var r=function(e){for(var t=[],n=0;n<e.length;n++)for(var a=0;a<e[n].length;a++){var c=e[n][a];2===c?(H(e,n,a)&&t.push(I(n,a,n+1,a-1)),E(e,n,a)&&t.push(I(n,a,n+1,a+1))):4===c&&(H(e,n,a)&&t.push(I(n,a,n+1,a-1)),E(e,n,a)&&t.push(I(n,a,n+1,a+1)),D(e,n,a)&&t.push(I(n,a,n-1,a-1)),V(e,n,a)&&t.push(I(n,a,n-1,a+1)))}return t}(e);if(0!==r.length)return r[Math.floor(Math.random()*r.length)]}function B(e){var t=Object(c.useState)([[2,0,2,0,2,0,2,0],[0,2,0,2,0,2,0,2],[2,0,2,0,2,0,2,0],[0,5,0,5,0,5,0,5],[5,0,5,0,5,0,5,0],[0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0],[0,1,0,1,0,1,0,1]]),n=Object(l.a)(t,2),i=n[0],r=n[1],s=Object(c.useState)(null),h=Object(l.a)(s,2),o=h[0],u=h[1],d=Object(c.useState)(null),b=Object(l.a)(d,2),f=b[0],w=b[1],y=Object(c.useState)(!0),v=Object(l.a)(y,2),R=v[0],C=v[1],P=R?"Show player tips":"Hide player tips",N=Object(c.useState)(F()),S=Object(l.a)(N,2),M=S[0],L=S[1],U=Object(c.useState)(!1),D=Object(l.a)(U,2),V=D[0],H=D[1],E=Object(c.useState)(null),I=Object(l.a)(E,2),W=I[0],A=I[1],G=Object(c.useState)([]),B=Object(l.a)(G,2),K=B[0],J=B[1];function F(){return i.map((function(e,t){var n=t;return Object(a.jsx)("tr",{children:e.map((function(e,t){return Object(a.jsx)("td",{className:"p-0",children:Object(a.jsx)(g,{state:e,y:n,x:t,setSquareToMoveTo:w,setCounterToMove:u})},n+t)}))},n)}))}function Y(){i[o.height][o.width]=5,i[f.height][f.width]=o.state,Q(),r(i),L(F()),e.setTurn(!1)}function z(t,n){i[o.height][o.width]=5,i[f.height][f.width]=o.state,2!==i[t][n]&&4!==i[t][n]||e.setPlayer2Counter(e.player2Counter+1),i[t][n]=5,Q(),r(i),L(F()),e.setTurn(!1)}function Q(){1===o.state&&0===f.height&&(i[f.height][f.width]=3)}function X(){for(var e=0;e<i.length;e++)for(var t=0;t<i[e].length;t++)6===i[e][t]&&(i[e][t]=5);r(i),L(F())}function Z(e){try{return i[f.height-1][f.width-1]===e&&(5===i[f.height-2][f.width-2]||6===i[f.height-2][f.width-2])||i[f.height-1][f.width+1]===e&&(5===i[f.height-2][f.width+2]||6===i[f.height-2][f.width+2])}catch(t){return!1}}function $(e){try{return i[f.height+1][f.width-1]===e&&(5===i[f.height+2][f.width-2]||6===i[f.height+2][f.width-2])||i[f.height+1][f.width+1]===e&&(5===i[f.height+2][f.width+2]||6===i[f.height+2][f.width+2])}catch(t){return!1}}function _(){for(var t=[],n=0;n<i.length;n++)t[n]=i[n].slice();J((function(n){return[].concat(Object(j.a)(n),[{turn:e.turn,board:t}])}))}function ee(e){for(var t=0,n=0;n<i.length;n++)for(var a=0;a<i[n].length;a++)i[n][a]!==e&&i[n][a]!==e+2||t++;return t}function te(){setTimeout((function(){var t=q(i);if(null!==t&&t!=={}&&void 0!==t){t.take&&(t.takes.forEach((function(e){i[e.height][e.width]=5})),e.setPlayer1Counter(e.player1Counter+t.takes.length));var n=i[t.currentHeight][t.currentWidth];i[t.currentHeight][t.currentWidth]=5,i[t.nextHeight][t.nextWidth]=n,7===t.nextHeight&&(i[t.nextHeight][t.nextWidth]=4),r(i),L(F()),e.setTurn(!0)}}),500)}return Object(c.useEffect)((function(){!function(){var t=k(i,1).concat(k(i,3)),n=k(i,2).concat(k(i,4));0===t.length&&0===n.length?(e.setResultsModalTitle("Tied game"),e.setResultsModalMessage("No player can move. Therefore the game ends in a tie. I hope you had fun playing."),e.setShowResultModal(!0)):0===t.length?(e.setResultsModalTitle("Player 2 wins"),e.setResultsModalMessage("Player 1 can no longer move. Player 2 wins. I hope you had fun playing."),e.setShowResultModal(!0)):0===n.length&&(e.setResultsModalTitle("Player 1 wins"),e.setResultsModalMessage("Player 2 can no longer move. Player 1 wins. I hope you had fun playing."),e.setShowResultModal(!0))}();var t,n=!0,a=!1;if(e.turn&&null!=o&&null!=f){if(1===o.state){var c=function(e,t){if(o.height+e===f.height&&(o.width-2===f.width||o.width+2===f.width)){var n=(f.height+o.height)/2,a=(f.width+o.width)/2;if(i[n][a]===t)return{result:!0,height:n,width:a}}return{result:!1}}(-2,2);c.result?(_(),z(c.height,c.width),a=!0,Z(2)&&(n=!1,H(!0))):(t=-1,o.height+t!==f.height||o.width-1!==f.width&&o.width+1!==f.width||(_(),Y(),a=!0))}else if(3===o.state)if(o.height-1===f.height||o.height+1===f.height)o.width-1!==f.width&&o.width+1!==f.width||(_(),Y(),a=!0);else if((o.height-2===f.height||o.height+2===f.height)&&(o.width-2===f.width||o.width+2===f.width)){var r=(f.height+o.height)/2,s=(f.width+o.width)/2;2!==i[r][s]&&4!==i[r][s]||(_(),z(r,s),a=!0,(Z(2)||Z(4)||$(2)||$(4))&&(n=!1,H(!0)))}X(),C(!0),u(null),w(null),n&&a?te():!1===a&&alert("Invalid move")}}),[f,o,i]),Object(c.useEffect)((function(){W?(e.setTurn(!0),A(null)):!1===W&&(te(),A(null))}),[W,e]),Object(a.jsxs)(T.a,{fluid:!0,children:[Object(a.jsx)("div",{className:"d-flex justify-content-center mb-3",children:Object(a.jsx)("h2",{children:"PC Mode"})}),Object(a.jsxs)(x.a,{className:"d-flex justify-content-center",children:[Object(a.jsx)(m.a,{className:"ml-2 mr-2 mb-4",children:Object(a.jsx)(p.a,{onClick:function(){e.turn&&(R?(!0===e.turn&&k(i,1).concat(k(i,3)).forEach((function(e){i[e.height][e.width]=6})),C(!1)):(X(),C(!0)),r(i),L(F()))},children:P})}),Object(a.jsx)(m.a,{className:"ml-2 mr-2 mb-4",children:Object(a.jsx)(p.a,{onClick:function(){if(0!==K.length){!1===R&&C(!0);for(var t=K[K.length-1],n=0;n<i.length;n++)for(var a=0;a<i[n].length;a++)6===t.board[n][a]?i[n][a]=5:i[n][a]!==t.board[n][a]&&(i[n][a]=t.board[n][a]);e.setTurn(t.turn),K.pop();var c=12-ee(1);e.setPlayer1Counter(c);var r=12-ee(2);e.setPlayer2Counter(r),L(F())}},children:"Undo"})})]}),Object(a.jsx)(O,{show:V,update:H,setJumpModalValue:A}),Object(a.jsx)("div",{className:"d-flex justify-content-center",children:Object(a.jsx)("table",{className:"gameBorder",children:Object(a.jsx)("tbody",{className:"border border-dark",children:M})})})]})}function K(e){return Object(a.jsxs)("div",{children:[Object(a.jsxs)(h.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle red center"+(!0===e.turn?" yellow":"")}),Object(a.jsx)("h3",{className:"p-4",children:"Player 1"})]}),Object(a.jsx)("br",{}),Object(a.jsxs)(h.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle blue center"+(!1===e.turn?" yellow":"")}),Object(a.jsx)("h3",{className:"p-4",children:"Player 2"})]})]})}function J(e){return Object(a.jsxs)("div",{children:[Object(a.jsxs)(h.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle red center"}),Object(a.jsx)("h3",{className:"p-4",children:"Single"})]}),Object(a.jsx)("br",{}),Object(a.jsxs)(h.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle red center",children:"K"}),Object(a.jsx)("h3",{className:"p-4",children:"King"})]})]})}function F(e){return Object(a.jsxs)("div",{children:[Object(a.jsxs)(h.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle red center"}),Object(a.jsx)("h3",{className:"m-0 p-4",children:e.player1Counter})]}),Object(a.jsx)("br",{}),Object(a.jsxs)(h.a,{className:"p-3",children:[Object(a.jsx)("div",{className:"circle blue center"}),Object(a.jsx)("h3",{className:"p-4",children:e.player2Counter})]})]})}function Y(e){var t=function(){return e.update(!1)};return Object(a.jsx)("div",{children:Object(a.jsxs)(f.a,{show:e.show,onHide:t,children:[Object(a.jsx)(f.a.Header,{closeButton:!0,children:Object(a.jsx)(f.a.Title,{children:e.title})}),Object(a.jsx)(f.a.Body,{children:e.message}),Object(a.jsxs)(f.a.Footer,{children:[Object(a.jsx)(p.a,{variant:"danger",onClick:t,children:"Close"}),Object(a.jsx)(p.a,{variant:"success",onClick:function(){return window.location.reload()},children:"Restart"})]})]})})}var z=i.a.createContext();function Q(e){var t=Object(c.useState)(null),n=Object(l.a)(t,2),i=n[0],r=n[1],s=Object(c.useState)(null),h=Object(l.a)(s,2),o=h[0],u=h[1];return Object(a.jsx)(z.Provider,{value:{pcOr2Player:i,handlePcOr2PlayerChange:function(e){r(e.target.value),"false"===e.target.value&&u(null)},easyOrHard:o,handleEasyOrHard:function(e){u(e.target.value)}},children:e.children})}function X(e){var t=Object(c.useState)(0),n=Object(l.a)(t,2),i=n[0],r=n[1],s=Object(c.useState)(0),u=Object(l.a)(s,2),j=u[0],b=u[1],g=Object(c.useState)(!1),f=Object(l.a)(g,2),p=f[0],O=f[1],x=Object(c.useState)(""),m=Object(l.a)(x,2),w=m[0],y=m[1],v=Object(c.useState)(""),R=Object(l.a)(v,2),C=R[0],P=R[1],k=Object(c.useContext)(z),T=Object(c.useState)(!0),S=Object(l.a)(T,2),M=S[0],L=S[1];return Object(c.useEffect)((function(){12===i?(y("Player 2 wins"),P("Well done on finishing the game of draughts. I hope you had fun playing."),O(!0)):12===j&&(y("Player 1 wins"),P("Well done on finishing the game of draughts. I hope you had fun playing."),O(!0))}),[i,j]),Object(a.jsxs)(h.a,{children:[Object(a.jsx)(Y,{show:p,update:O,title:w,message:C}),Object(a.jsx)(o.a,{xl:"1"}),Object(a.jsxs)(o.a,{xl:"7",children:["true"===k.pcOr2Player?Object(a.jsx)(B,{player1Counter:i,setPlayer1Counter:r,player2Counter:j,setPlayer2Counter:b,turn:M,setTurn:L,setResultsModalTitle:y,setShowResultModal:O,setResultsModalMessage:P}):Object(a.jsx)(N,{player1Counter:i,setPlayer1Counter:r,player2Counter:j,setPlayer2Counter:b,turn:M,setTurn:L,setResultsModalTitle:y,setShowResultModal:O,setResultsModalMessage:P}),Object(a.jsx)("br",{})]}),Object(a.jsxs)(o.a,{xl:"3",children:[Object(a.jsx)(d,{title:"Players",innerComponent:Object(a.jsx)(K,{turn:M})}),Object(a.jsx)("br",{}),Object(a.jsx)(d,{title:"Pieces",innerComponent:Object(a.jsx)(J,{})}),Object(a.jsx)("br",{}),Object(a.jsx)(d,{title:"Pieces Taken",innerComponent:Object(a.jsx)(F,{player1Counter:i,player2Counter:j})}),Object(a.jsx)("br",{})]}),Object(a.jsx)(o.a,{xl:"1"})]})}n(62);function Z(){return Object(a.jsx)(T.a,{fluid:!0,children:Object(a.jsxs)(h.a,{children:[Object(a.jsx)(o.a,{xl:"1"}),Object(a.jsxs)(o.a,{xl:"10",children:[Object(a.jsx)("div",{children:Object(a.jsx)("h1",{children:"How To Play Draughts"})}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"Goal"}),Object(a.jsx)("p",{children:"The goal of the game of draughts is to take all of the opponent's pieces."})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"Summary"}),Object(a.jsx)("p",{children:"Draughts is a simple game with limited movement. There are two types of pieces in the game. Singles and kings, they can be differentiated with kings having a 'K' in the centre of the game piece. Singles can only move towards the opponents end of the board whereas kings can move both up and down the board. The game starts with only single pieces in play. Kings can be achieved by a player moving a piece to the far end of the board."}),Object(a.jsx)("p",{children:"Players take it in turn to move a single game piece. Pieces can only move in a diagonal direction by one square therefore not white square can be used. Only one piece can occupy a square. Players can take an opponents piece by jumping a character if the square diagonally behind the piece is available."})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"Rules"}),Object(a.jsxs)("ul",{children:[Object(a.jsx)("li",{children:"Player play the game in turns"}),Object(a.jsx)("li",{children:"Players can only move one piece during a turn"}),Object(a.jsx)("li",{children:"Kings are automatically created"}),Object(a.jsx)("li",{children:"Piece can only move diagonally"}),Object(a.jsx)("li",{children:"Singles only move towards to the opponent"}),Object(a.jsx)("li",{children:"Kings can only move up and down"}),Object(a.jsx)("li",{children:"Pieces can only take a character if the space diagonally behind it is free"})]})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"How to play"}),Object(a.jsx)("p",{children:"A yellow ring will appear around the piece to identify whos turn it is in the players section."}),Object(a.jsx)("p",{children:"The pieces taken section will keep count of the pieces taken, once a player gets to 12 they lose."}),Object(a.jsx)("p",{children:"To move a piece click on the piece you want to move and the square you want to move it to. The game will do the rest and make you the move is valid."}),Object(a.jsx)("p",{children:"The game will automatically king piece."})]})]}),Object(a.jsx)(o.a,{xl:"1"})]})})}var $=n(50);function _(e){var t=e.features.map((function(e,t){return Object(a.jsx)("li",{children:e},t)}));return Object(a.jsx)(u.a,{children:Object(a.jsxs)(u.a.Body,{children:[Object(a.jsx)(u.a.Header,{children:Object(a.jsx)("h3",{children:e.title})}),Object(a.jsxs)(u.a.Text,{children:[Object(a.jsx)("h5",{children:"Features"}),Object(a.jsx)("ul",{children:t})]}),Object(a.jsx)($.a,{variant:e.colour,children:e.status})]})})}function ee(){return Object(a.jsx)(T.a,{fluid:!0,children:Object(a.jsxs)(h.a,{children:[Object(a.jsx)(o.a,{xl:"1"}),Object(a.jsxs)(o.a,{xl:"10",children:[Object(a.jsxs)("div",{children:[Object(a.jsx)("h1",{children:"About"}),Object(a.jsx)("p",{children:"This game was made in loving memory of my grandad, Ernest Rumbol. My grandad taught me this game many years ago. Over the years we have played thousands of games together. As I got older and understood the game more, the more games I won. However, grandad still loved playing even when he wiped the board clean because he lost the game after the first move. We played with many different rule sets, his favourite was forcing users to take a piece if available, I thought the game was more tactical if you didn't. I hope that people play this game with as much fun as we did."})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"Technical information"}),Object(a.jsxs)("p",{children:["Below lets the tools used to build this web application. You can find the source code at the ",Object(a.jsx)("a",{href:"https://github.com/OllieRumbol/draughtsgame",children:"Git Repo"})]}),Object(a.jsxs)("ul",{children:[Object(a.jsx)("li",{children:Object(a.jsx)("a",{href:"https://reactjs.org/",children:"React with hooks"})}),Object(a.jsx)("li",{children:Object(a.jsx)("a",{href:"https://react-bootstrap.github.io/",children:"React bootstrap"})}),Object(a.jsx)("li",{children:Object(a.jsx)("a",{href:"https://reactrouter.com/web/guides/quick-start",children:"React router"})}),Object(a.jsx)("li",{children:Object(a.jsx)("a",{href:"https://pages.github.com/",children:"Git pages (for hosting)"})}),Object(a.jsx)("li",{children:Object(a.jsx)("a",{href:"https://testing-library.com/docs/react-testing-library/intro/",children:"React testing"})})]})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{children:"Project Plan"}),Object(a.jsxs)("div",{className:"card-columns",children:[Object(a.jsx)(_,{title:"Draughts Game Phase 1 Epic",colour:"success",features:["React Project Setup","Board setup","Counter setup","UI design","Move counter","Take counter","Game end","King me","Turns"],status:"Complete"}),Object(a.jsx)(_,{title:"React Router Epic",colour:"success",features:["Setup","Refactor","Production changes"],status:"Complete"}),Object(a.jsx)(_,{title:"Pages Epic",colour:"success",features:["How to play","About"],status:"Complete"}),Object(a.jsx)(_,{title:"CI/CD and Unit Tests Epic",colour:"warning",features:["Create basic pipeline in yaml","Setup testing environment and add to pipeline","Unit test components","Unit test web app logic"],status:"In progress"}),Object(a.jsx)(_,{title:"Player tips Epic",colour:"success",features:["UI changes to display user tips","Logic to work out where a player can move","Logic to work out where a player can take another counter"],status:"Complete"}),Object(a.jsx)(_,{title:"Draughts Game Phase 2 Epic",colour:"success",features:["Double jumps","Game over - no one can move","Restart","Undo","CSS for selecting a counter"],status:"Complete"}),Object(a.jsx)(_,{title:"Automated 2nd Player Phase 1 Epic",colour:"success",features:["Game setup page, 2 player or VS PC. Along with other settings","Web app logic for PC to decide next move (random logic)","Render PC move on page"],status:"Complete"}),Object(a.jsx)(_,{title:"Automated 2nd Player Phase 2 Epic",colour:"warning",features:["Use some kind of genetic search algorithm to find best move","Add new setting to the game setting page for other opponent type","Use new setting in the frontend"],status:"In progress"}),Object(a.jsx)(_,{title:"Mobile responsive UI Epic",colour:"danger",features:["Game setup page is mobile responsive","Game board page is mobile responsive","How to play page is mobile responsive","About page is mobile responsive"],status:"Not started"}),Object(a.jsx)(_,{title:"Draughts Game Phase 3 Epic",colour:"danger",features:["Setting to decide who goes first","Setting for if singles can take kings","Update how to play"],status:"Not started"}),Object(a.jsx)(_,{title:"Automated 2nd Player Phase 3 Epic",colour:"danger",features:["Refactor logic from V1 and V2","Improve algorithm with alpha beta pruning","Experiment with different depths","Improve evaluation function"],status:"Not started"}),Object(a.jsx)(_,{title:"Tutorial 3 Epic",colour:"danger",features:[],status:"Not started"}),Object(a.jsx)(_,{title:"Support Epic",colour:"danger",features:["Game tips results in no possible moves (26/01/21)","Player tips not showing all possible moves for a king (31/01/21)","Player tips infinite loop (1/2/21)","Double jumps and undo (2/2/21)","Undo is hiding player tips when no moves have been made (6/2/21)","Change board layout, currently  back to front"],status:"Paused due to no further work"}),Object(a.jsx)(_,{title:"Technical Debt Epic Epic",colour:"danger",features:["Refactor main use effect logic (28/01/21)","Refactor player tips logic"],status:"Paused due to no further work"})]})]}),Object(a.jsx)("br",{})]}),Object(a.jsx)(o.a,{xl:"1"})]})})}n(63);function te(e){var t=Object(c.useContext)(z);return Object(a.jsx)(T.a,{fluid:!0,children:Object(a.jsxs)(h.a,{children:[Object(a.jsx)(o.a,{xl:"1"}),Object(a.jsxs)(o.a,{xl:"10",children:[Object(a.jsx)("div",{children:Object(a.jsx)("h1",{children:"Game settings"})}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{className:"pb-2",children:"Opponent"}),Object(a.jsx)("div",{children:Object(a.jsxs)("label",{className:"radioContainer",children:[Object(a.jsx)("div",{className:"topper",children:"PC"}),Object(a.jsx)("input",{type:"radio",name:"radio",value:!0,onChange:t.handlePcOr2PlayerChange}),Object(a.jsx)("span",{className:"checkMark"})]})}),Object(a.jsx)("div",{children:Object(a.jsxs)("label",{className:"radioContainer",children:[Object(a.jsx)("div",{className:"topper",children:"2 Player"}),Object(a.jsx)("input",{type:"radio",name:"radio",value:!1,onChange:t.handlePcOr2PlayerChange}),Object(a.jsx)("span",{className:"checkMark"})]})}),"true"===t.pcOr2Player&&Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{className:"pb-2",children:"Difficulty"}),Object(a.jsx)("div",{children:Object(a.jsxs)("label",{className:"radioContainer",children:[Object(a.jsx)("div",{className:"topper",children:"Easy"}),Object(a.jsx)("input",{type:"radio",name:"radio2",value:!0,onChange:t.handleEasyOrHard}),Object(a.jsx)("span",{className:"checkMark"})]})}),Object(a.jsx)("div",{children:Object(a.jsxs)("label",{className:"radioContainer",children:[Object(a.jsx)("div",{className:"topper",children:"Hard"}),Object(a.jsx)("input",{type:"radio",name:"radio2",value:!1,onChange:t.handleEasyOrHard}),Object(a.jsx)("span",{className:"checkMark"})]})})]})]}),Object(a.jsx)("div",{children:Object(a.jsx)(p.a,{variant:"success",onClick:function(){null!=t.pcOr2Player&&("true"===t.pcOr2Player&&null!==t.easyOrHard||"false"===t.pcOr2Player)&&e.setHasSetGameSettings(!0)},children:"Submit"})})]}),Object(a.jsx)(o.a,{xl:"1"})]})})}var ne=n(32),ae=n(8),ce=n(49);n(64);function ie(){var e=Object(c.useState)(!1),t=Object(l.a)(e,2),n=t[0],i=t[1];return Object(a.jsx)(Q,{children:Object(a.jsx)(ne.a,{children:Object(a.jsxs)(T.a,{fluid:!0,children:[Object(a.jsx)(ce.a,{fluid:!0,children:Object(a.jsxs)(T.a,{children:[Object(a.jsx)("h1",{"data-testid":"title",className:"display-1 font-weight-bold",children:"Draughts Game"}),Object(a.jsx)("h4",{children:"A draughts game built in react js"}),Object(a.jsx)("hr",{className:"my-4"}),Object(a.jsxs)(x.a,{children:[Object(a.jsx)(ne.b,{to:"/",children:Object(a.jsx)(m.a,{className:"mr-2",children:Object(a.jsx)(p.a,{"data-testid":"link",variant:"primary",children:"Home"})})}),Object(a.jsx)(ne.b,{to:"/howtoplay",children:Object(a.jsx)(m.a,{className:"mr-2",children:Object(a.jsx)(p.a,{"data-testid":"link",variant:"primary",children:"How to play"})})}),Object(a.jsx)(ne.b,{to:"/about",children:Object(a.jsx)(m.a,{className:"mr-2",children:Object(a.jsx)(p.a,{"data-testid":"link",variant:"primary",children:"About"})})})]})]})}),Object(a.jsx)("main",{children:Object(a.jsxs)(ae.c,{children:[Object(a.jsx)(ae.a,{path:"/",exact:!0,component:function(){return n?Object(a.jsx)(X,{}):Object(a.jsx)(te,{setHasSetGameSettings:i})}}),Object(a.jsx)(ae.a,{path:"/howtoplay",exact:!0,component:function(){return Object(a.jsx)(Z,{})}}),Object(a.jsx)(ae.a,{path:"/about",exact:!0,component:function(){return Object(a.jsx)(ee,{})}})]})})]})})})}s.a.render(Object(a.jsx)(ie,{}),document.getElementById("root"))}},[[68,1,2]]]);
//# sourceMappingURL=main.b5916074.chunk.js.map