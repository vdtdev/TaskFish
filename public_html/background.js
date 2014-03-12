/*
 * vdtdev-----
 * TaskFish Application ~ Chrome ~ /bin/background.js
 * @author Wade Harkins (vdtdev@gmail.com)
 * @since 20131110
 */

chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('task.html', {
		'bounds' : {
			'width' : 245,
			'height' : 400
		},
		'maxWidth':400,
		'maxHeight':900
	});
	/*	'maxWidth':640,
		'maxHeight':400
	});*/
	/*chrome.app.window.setMaxWidth(640);
	chrome.app.window.setMaxHeight(400);*/
}); 