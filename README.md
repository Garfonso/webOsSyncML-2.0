This is a SyncML client for webOS 2.X

It basically is a adjusted version of https://github.com/Garfonso/webOsSyncML for webOS 2.x.
It does not integrate nicely into synergy. I recommend looking at https://github.com/Garfonso/SyncML 
instead for 2.x and 3.x devices. Or even better https://github.com/webOS-ports/org.webosports.service.contacts.carddav/
if your server supports caldav. The SyncML connectors are not maintained anymore.

It compiles funambol as C++ library and uses it in a 
webOS PDK plugin.

This plugin is used in a hybrid app to talk to SyncML servers.
Calendar entries and Contacts should be supported.

Only tested with eGroupware Server. Expect problems with other servers.

Not supported anymore, just published for public domain use...
funambol is AGPL licensed.


