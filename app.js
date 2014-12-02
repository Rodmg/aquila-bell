// app.js
/*
    This example will send an email when a "bell" is pressed.
    The bell will be an Altair programmed with the example "Example_ButtonEvent".

    Steps:
    1. Upload the example to one Altair, you can find it in the Arduino IDE, 
    File > Examples > Altair > Example_ButtonEvent.
    2. Program other Altair as bridge and keep it connected to the PC
    3. Launch the Aquila Server
    4. Power the Altair programmed as the "bell"
    5. Launch this program with "node app.js"
    6. Press the button on the "bell", you should see a message in the terminal and 
    receive an email.

    Note: You must first edit this code with your correct Email user and password, 
    and the mail content.

    Tip: You could easily modify this code for using IFTTT, you could use the "Email Channel"
    in IFTTT to trigger different web services.
*/

var nodemailer = require("nodemailer");
var Aquila = require("aquila-client");
// specify your hub url
aq = new Aquila("http://localhost:8080");

// Configuration:
// The name of the device that you want to bind to:
var DEVICE_NAME = "Button";
// The name of the Event:
var EVENT_NAME = "Button Pressed";


// Email setup:
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "SENDER@gmail.com",
        pass: "YOUR PASSWORD"
    }
});

// email content
var mailContent = {
    from: "Aquila <SENDER@gmail.com>",
    to: "RECEIVER@gmail.com",
    subject: "#bell",
    text: "Someone rang the bell"
};

// make connection and login to the Aquila Server
aq.login("Admin", "Admin", function(err)
    {
    	// attend any error on connection
        if(err) return console.log(err.message);

        // # for searching by name
        aq.devices("#" + DEVICE_NAME).on(EVENT_NAME, function(param)
        	{
        		console.log("Someone rang the bell");
        		// Send mail
				transporter.sendMail(mailContent, function(error, info)
				{
					if(error){
						console.log(error);
					}else{
						console.log("Message sent: " + info.response);
					}
				});
        	});
    });
