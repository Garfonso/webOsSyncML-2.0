function SyncSceneAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

SyncSceneAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	this.oldLog = log;
	log = logGUI.bind(this,this.controller);
	
	eventCallbacks.eventsUpdatedElement = this.controller.get("eventsUpdated");
	eventCallbacks.eventsUpdateFailedElement = this.controller.get("eventsUpdateFailed");
	eventCallbacks.eventsAddedElement = this.controller.get("eventsAdded");
	eventCallbacks.eventsAddFailedElement = this.controller.get("eventsAddFailed");
	eventCallbacks.eventsDeletedElement = this.controller.get("eventsDeleted");
	eventCallbacks.eventsDeleteFailedElement = this.controller.get("eventsDeleteFailed");
	//eventCallbacks.log = log.bind(this);
	eventCallbacks.controller = this.controller;

	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	this.controller.setupWidget("btnStart", { type : Mojo.Widget.activityButton }, { label: $L("Start sync")});
	
	/* add event handlers to listen to events from widgets */
	Mojo.Event.listen(this.controller.get("btnStart"),Mojo.Event.tap,this.startSync.bind(this));	
	
	try {
		cPlugin.setup(this.controller.get("webOsSyncMLPlugin"));
		cPlugin.thePluginObject.updateStatus = log.bind(this,this.controller);
		cPlugin.thePluginObject.finished = SyncSceneAssistant.prototype.finished.bind(this);
	}
	catch(e)
	{
		log("Error" + e + " - " + JSON.stringify(e));
	}
	
	this.checkAccount();
};

SyncSceneAssistant.prototype.checkAccount = function() 
{
	log("Check account");
	if (account.webOsAccountId !== undefined) {
		log("Have account Id: " + account.webOsAccountId);
		account.getAccountInfo(function(){ eventCallbacks.checkCalendar();}, 
		function(){
			log("No account..");
			account.webOsAccountId = undefined;
			this.checkAccount();
		}.bind(this));
	}
	else {
		log("Need to create account.");
		account.createAccount(function(){ eventCallbacks.checkCalendar();});
	}
};

SyncSceneAssistant.prototype.startSync = function()
{
	try
	{
		var doCal = 0;
		var doCon = 0;
		if(account.syncCalendar)
		{
			doCal = 1;
		}
		if(account.syncContacts)
		{
			doCon = 1;
		}
		var result = cPlugin.thePluginObject.startSync(account.username,account.password,account.url,doCal,
		                                        doCon,account.syncCalendarPath,account.syncCalendarMethod,account.syncContactsPath,account.syncContactsMethod);

		this.controller.get("btnStart").mojo.activate();

		if ( result === null )
		{
			log("result is null");
		}
		else
		{
			log("result: " + result);
		}
	}
	catch(e)
	{
		log("exception: "+e);
	}
};

SyncSceneAssistant.prototype.finished = function(calOk,conOk)
{
	if(account.syncCalendar)
	{
		if(calOk === "ok")
		{
			log("Calendar sync worked.");
			eventCallbacks.finishSync(true);
		}
		else
		{
			log("Calendar sync had errors.");
			//account.syncCalendarMethod = "slow";
		}
	}
	if(account.syncContacts)
	{
		if(conOk === "ok")
		{
			log("Contacts sync worked.");
			//TODO: call doneWithChanges!
		
			if (account.syncContactsMethod === "slow" || account.syncContactsMethod.indexOf("refresh") !== -1) {
				account.syncContactsMethod = "two-way";
			}
		}
		else
		{
			log("Contacts sync had errors.");
			//account.syncContactsMethod = "slow";
		}
	}
	
	this.controller.get("btnStart").mojo.deactivate();
};

SyncSceneAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SyncSceneAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
	log = this.oldLog;
	account.saveConfig();
};

SyncSceneAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
