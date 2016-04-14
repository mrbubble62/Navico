"use strict";

var websocketConnection;
function InitWebsocket( url )
{
    alert(url);
	if ("WebSocket" in window)
    {
        try
        {
            if (typeof MozWebSocket === 'function')
            {
                window.WebSocket = MozWebSocket;
            }
            websocketConnection = new WebSocket( url );

            websocketConnection.onopen = function (evt )
            {
                setTimeout( function ()
                        {
                            // do something when we connect
                            onWebsocketConnect();
                        }, 0);
                                
            };
            websocketConnection.onclose = function ( evt )
            {
                setTimeout( function ()
                        {
                            onWebsocketClose();
                        }, 0 );
            };
            websocketConnection.onmessage = function ( evt )
            {
				setTimeout( function ()
                        {
                            onWebsocketMessage( evt.data );
                        }, 0 );
            };
            // don't care about websocketConnection.onError
        }
        catch(err)
        {
            alert(err);
        }
    }
    else
    {
        alert( "no websocket support" );
    }
}

function onWebsocketConnect()
{
    alert("connected");
}

function onWebsocketClose()
{
    alert("close");
}

function onWebsocketMessage( incoming )
{
    var javascriptObject = JSON.parse( incoming );
	var output = "";
	if ( javascriptObject.hasOwnProperty("SettingList") )
	{
		output += ("SettingList response: \n\n");
		output += (incoming + "\n\n");
		var data = javascriptObject.SettingList;
		output += "groupId: " + data.groupId + "\n";
		
		if (data.valid == false)
		{
			output += " invalid";
		}
		else
		{
			output += "ids: ";
			var list = data.list;
			for ( var i = 0; i < list.length; i++)
			{
				output += list[i] + " ";
			}
		}	
	}
	else if( javascriptObject.hasOwnProperty("SettingInfo") )
    {
		output += "SettingInfo response: \n\n";
		output += (incoming + "\n\n");
		var dataArray = javascriptObject.SettingInfo;
		for( var i = 0; i < dataArray.length; i++ )
        {
			var data = dataArray[i];
			output += ("id: " + data.id + "\n");
            if( data.valid === false )
            {
                output += " invalid data";
            }
            else
            {
                output += ("name: " + data.name + "\n");
				output += ("type: " + data.type + "\n");
				var type = data.type;
				switch (type)
				{
					case 1 :
					{
						output += "Options: [";
						var values = data.values;
						for ( var j = 0; j < values.length; j++ )
						{
							if (j != 0) 
								output += ", ";
							var value = values[j];
							output += (value.id + " : " + value.title);
						}
						output += "]";
					}
					break;
					
					case 2 :
					case 4 :
						break;
					
					case 3 :
					{
						output += ("high: " + data.high + "\n");
						output += ("low: " + data.low + "\n");
						output += ("step: " + data.step + "\n");
					}
					break;
					
					default:
						{
						output += "Options: [";
						var values = data.values;
						for ( var j = 0; j < values.length; j++ )
						{
							if (j != 0) 
								output += ", ";
							var value = values[j];
							output += (value.id + " : " + value.title);
						}
						output += "]";
					}
				}
				
				
            } 
			output += "\n\n";
        }
    }
	else if( javascriptObject.hasOwnProperty("Setting") )
    {
        output += ("Setting response: \n\n");
		output += (incoming + "\n\n");
		var dataArray = javascriptObject.Setting;
		for( var i = 0; i < dataArray.length; i++ )
        {
            var data = dataArray[i];
            if( data.valid === false )
            {
                output += (data.id + " : invalid");
            }
            else
            {
                output += (data.id + " : " + data.value);
            } 
			output += "\n";
        }
    }
    else
    {
        output += ("unKnown response: \n\n");
		output += (incoming);
    }
	
	alert(output);
}

function SettingListReq(groupId)
{
	alert('SettingListReq: \n\n' + '{"SettingListReq":[{"groupId":' + groupId + '}]}');
	websocketConnection.send('{"SettingListReq":[{"groupId":' + groupId + '}]}');
}

function SettingInfoReq(ids)
{
	alert('SettingInfoReq: \n\n' + '{"SettingInfoReq":[' + ids + ']}');
    websocketConnection.send('{"SettingInfoReq":[' + ids + ']}');
}

function SettingReq(ids, register)
{
	alert('SettingReq: \n\n' + '{"SettingReq":{"ids":[' + ids + '],"register":' + register +'}}');	
    websocketConnection.send('{"SettingReq":{"ids":[' + ids + '],"register":' + register +'}}');
}

function Setting(id, value)
{
	alert('Setting: \n\n' + '{"Setting":[{"id":' + id +',"value":' + value + '}]}');
	websocketConnection.send('{"Setting":[{"id":' + id +',"value":' + value + '}]}');
}
