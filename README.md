# House Bell with Aquila example.

This is an example of a server application for the Aquila API.

This example will send an email when a "bell" is pressed.
The bell will be an Altair programmed with the example "Example_ButtonEvent".

### Installation

``npm install aquila-bell``

### Use:

1. Upload the example to one Altair, you can find it in the Arduino IDE, 
File > Examples > Altair > Example_ButtonEvent.
2. Program other Altair as bridge and keep it connected to the PC
3. Launch the Aquila Server
4. Power the Altair programmed as the "bell"
5. Launch this program with "node app.js"
6. Press the button on the "bell", you should see a message in the terminal and 
receive an email.

**Note:** You must first edit the code in app.js with your correct Email user and password, 
and the mail content.

**Tip:** You could easily modify this code for using IFTTT, you could use the "Email Channel"
on IFTTT to trigger different web services.

----

# Tutorial: How to create an application for the Aquila API

The Aquila Server provides a REST API and a web socket interface for making client apps.
There are two main types of apps:

1. Server apps: apps that run on a server, or on the same Hub, that monitor devices and provide services.
2. UI apps, that run on a browser and provide a graphical interface to the user.

In this tutorial we will be making a Server app.

The goal of the app will be sending an email when a button is pressed, we will imagine that this button
is a house bell, and the email will inform us that someone rang the bell.

For this we will first define the hardware for the bell, this will be an Altair, of which we will be using 
its built-in button (Pin 33) as the bell.

Now we will start programming the code. For this we will be using the terminal and node.js. (if you are on Windows, 
please use Git Bash or similar UNIX style terminal).

1. Create the project folder:
	
	``mkdir aquila-bell``

2. Enter the folder
	
	``cd aquila-bell``

3. Initialize a new node.js project, you will be prompted some questions: as the name for your app, we 
will use "bell", as the name of the main file, we will use "app.js", everything else will be left as default.
	
	``npm init``

4. install the aquila-client ant the nodemailer libraries:
	
	``npm install aquila-client nodemailer --save``

5. Create your main file with the name you previously indicated:
	
	``touch app.js``

6. Open ``app.js`` with your favorite text editor. I will use Sublime Text.

### Code

Now we will (finally) start coding:

First, we need to import the required libraries and initialize the Aquila client library, passing the url of
your server. I'm running the server in the same computer i'm programming, so I'll use ``http://localhost:8080``:
```
var nodemailer = require("nodemailer");
var Aquila = require("aquila-client");
// specify your hub url
aq = new Aquila("http://localhost:8080");
```

Then, we will make two variables for storing our device configuration:
```
// Configuration:
// The name of the device that you want to bind to:
var DEVICE_NAME = "Button";
// The name of the Event:
var EVENT_NAME = "Button Pressed";
```

Next, we are configuring the Email, first is the transport object, here you must pass the credentials of the account
that will send the Email, then the content of the email that will be sent, including the receiver address:
```
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
```

Finally, the code that will be making the real work:
Here, we are making a connection to the Aquila Server, passing user, password and a function that will be called
when the connection is made. 

Then, we are requesting a list of devices that match the device name, and then subscribing another
function to when the event EVENT_NAME of these devices is emitted; in this function we are simply printing in console that
"Someone rang the bell", and sending the Email.
```
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
```

### Running the app

1. Upload the example to one Altair, you can find it in the Arduino IDE, 
File > Examples > Altair > Example_ButtonEvent.
2. Program other Altair as bridge and keep it connected to the PC
3. Launch the Aquila Server
4. Power the Altair programmed as the "bell"
5. Launch this program with ``node app.js``
6. Press the button on the "bell", you should see a message in the terminal and 
receive an email.

**Tip:** You could easily modify this code for using IFTTT, you could use the "Email Channel"
on IFTTT to trigger different web services.

Fore more info on how to make apps for the Aquila API, check the [aquila-client-node repo on GitHub](https://github.com/makerlabmx/aquila-client-node).

You can also interactively test code and monitor the Aquila network with the [aquila-monitor](https://github.com/makerlabmx/aquila-monitor).

You can get this code on [aquila-bell repo on GitHub](https://github.com/Rodmg/aquila-bell).