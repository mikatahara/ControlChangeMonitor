const DSIZE=1024;
const CTRL7=128;
const BENDMAX=16384;
const mVnum=5;		//âΩñ{ÇÃê¸Çï`Ç≠Ç©ÅH
var fdg1 = null;

var mCtrl= [1,2,3,4];
var mVal=Array(CTRL7);
var mBend;
var mData=[null,null,null,null,null];
var vhoge=null;

window.onload = function()
{
	runTest();
	setInputMenuID(document.input_device_select.ids);
	setOutputMenuID(document.output_device_select.ids);

	var hoge = setInterval(function() {
	    //èIóπèåè
		if (input != null) {
			input.onmidimessage = handleMIDIMessageLocal;
			clearInterval(hoge);
			start_graph();
		}
	}, 200);

	mCtrl[0]=$('#ctrl1').val();
	mCtrl[1]=$('#ctrl2').val();
	mCtrl[2]=$('#ctrl3').val();
	mCtrl[3]=$('#ctrl4').val();

	$('#ctrl1').change(function() { var val = $(this).val(); rCtrl1Change(val,0); });
	$('#ctrl2').change(function() { var val = $(this).val(); rCtrl1Change(val,1); });
	$('#ctrl3').change(function() { var val = $(this).val(); rCtrl1Change(val,2); });
	$('#ctrl4').change(function() { var val = $(this).val(); rCtrl1Change(val,3); });

	$('#bstop').click(function() {
        
        if($(this).val()=="START"){
            $(this).val("STOP");
			start_graph();
    }else{
            $(this).val("START");
			clearInterval(vhoge);
        }
    });

	display_init();

	for(var i=0; i<mVnum; i++) mData[i]=Array(DSIZE);
	for(var i=0; i<mVnum; i++){ for(j=0; j<DSIZE; j++) mData[i][j]=0; }
	for(var i=0; i<CTRL7; i++){ mVal[i]=0; }

};

/* ï`âÊóÃàÊÇÃèâä˙âª */
function display_init(){
	fdg1 = new DrawGraph(0,1024,0,256);
	fdg1.fSetCanvas(document.getElementById('ctrlshape'));
	fdg1.fResize();
	fdg1.fFillColor("#ccccff");
	fdg1.fLine(0,0,fdg1.cv.width,fdg1.cv.height);
	fdg1.fLine(fdg1.cv.width,0,0,fdg1.cv.height);
	fdg1.fSetWindowXY(0,fdg1.cv.width,0,fdg1.cv.height);
	fdg1.fSetViewPort(0,DSIZE,0,CTRL7);
	fdg1.fStrokeRect();
}

function handleMIDIMessageLocal( event )
{
	if(event.data[0]==0xB0){
		mVal[event.data[1]]=event.data[2];
	} else if( event.data[0]==0xE0 ){
		mBend=((event.data[2]&0x7F)<<7)+(event.data[1]&0x7F);
	}
}

function inputDeviceSelectLocal( item )
{
	inputDeviceSelect( item );
	input.onmidimessage = handleMIDIMessageLocal;
}

function start_graph()
{
	vhoge = setInterval(function() {
		for(var i=0; i<mVnum; i++){
			for(var j=0; j<DSIZE-1; j++){
				mData[i][DSIZE-1-j]=mData[i][DSIZE-2-j];
			}
		}
		mData[0][0]=mVal[mCtrl[0]];
		mData[1][0]=mVal[mCtrl[1]];
		mData[2][0]=mVal[mCtrl[2]];
		mData[3][0]=mVal[mCtrl[3]];
		mData[4][0]=mBend/BENDMAX*CTRL7;

		fdg1.fClearWindowInside();
		fdg1.fFillColor("#FFFF88");
		fdg1.fDrawLine(mData[0]);
		fdg1.fFillColor("#00FF00");
		fdg1.fDrawLine(mData[1]);
		fdg1.fFillColor("#FF0088");
		fdg1.fDrawLine(mData[2]);
		fdg1.fFillColor("#8800FF");
		fdg1.fDrawLine(mData[3]);
		fdg1.fFillColor("#FF8800");
		fdg1.fDrawLine(mData[4]);
	}, 40);
}

function rCtrl1Change( cnum, n )
{
	mCtrl[n]=cnum;
	for(var j=0; j<DSIZE; j++){ mData[n][j]=0; }
}
