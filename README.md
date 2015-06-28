# ti-fabric

Fabric Crashlytics in Titanium build hook.

## Cuation

* **This hook plugin is working in progress**
* Working on Titanium SDK 4.0.0.GA
* Code injection to TiApp.m
* If it does not launch, ```$ ti clean``` :grin:

## Preparation

1. To the device build once
2. Launch the Fabric
3. Select build/iphone/[YOUR APP NAME].xcodeproj
4. Install Crashlytics
5. Copy shell script in Fabric ```./Fabric.framework/run XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY```
6. Open the build/iphone/[YOUR APP NAME].xcodeproj at Xcode
7. Build Phases -> + -> New Run Script Phase
8. open Run Script -> Copy 5. shell script
9. Cmd+B
10. Drag the trunk icon in your Titanium app project folder(Do not drag the build/iphone/ folder) 
11. Open the build/iphone/Info.plist
12. Copy and paste your tiapp.xml ios section. And BuildSecret section is 5. second argument

e.g.

```xml
<key>Fabric</key>
<dict>
	<key>APIKey</key>
	<string>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</string>
	<key>BuildSecret</key>
	<string>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</string>
	<key>Kits</key>
	<array>
		<dict>
			<key>KitInfo</key>
			<dict>
			</dict>
			<key>KitName</key>
			<string>Crashlytics</string>
		</dict>
	</array>
</dict>
```

## Installation

1. ```$ git clone git@github.com:k0sukey/ti-fabric-hook.git```
2. ```$ cd ti-fabric-hook```
3. ```$ npm install```
4. ```$ node ./build.js```
5. Copy the zip file to your Titanium app project folder
6. Edit the tiapp.xml plugins section

```xml
<plugins>
	<plugin version="0.0.1">ti.fabric</plugin>
</plugins>
```

## Building

### Manually deploy

```sh
$ ti build -p ios -T device --build-only --fabric
```

### Auto deploy

```sh
$ ti build -p ios -T device --build-only --fabric --crashlytics-email foo@example.com
```

### Show all options at the help

```sh
$ ti build -p ios -T device --build-only --fabric --fabric-help
```

## Uninstall

Delete the tiapp.xml ti.fabric plugin section