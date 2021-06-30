
# SIGNL4 Duty Schedule Import

SIGNL4 offers powerful duty scheduling for routing alerts to the right people at the right time.

In some cases, customers use other tools as leading system for duty scheduling, e.g. SAP, Excel, etc. Here we describe how to import duty schedules from .csv files. If you use other tools or other formats you can first export your scheduled into a .csv file and proceed from there.

## Usage and Sample Code

Attention: This code is intended as a sample and only lightly tested with no guarantee. Please use with care.

Attention 2: Existing duty schedules will be overridden.

We provide a sample Node.js script for importing duty schedules from a CSV file. The sample file uses the SIGNL4 REST API as documented here:
[https://connect.signl4.com/api/docs/index.html](https://connect.signl4.com/api/docs/index.html)

As a prerequisite you first need to install Node.js as described [here](https://nodejs.org/en/download/).

The sample code is provided in the file 'schedule-import.js'. You can execute the wile with the node command. The file takes the path to the .csv file as an argument.

Command line sample:

    node schedule-import.js C:\schedule.csv

Within the source file you need to adapt the SIGNL4 API key and the team name:

```
const strAPIKey = 'YOUR-SIGNL4-API-KEY';
const strTeamName = 'Super SIGNL4';
```

You can create the API key in your SIGNL4 web portal under Teams -> Developer.

## CSV File

The .csv file has the following format:

Email,Start,End

**Email**: The email address of the SIGNL4 user. If you use 'DELETE', all scheduled in the given range are deleted.  
**Start**: Schedule start date and time.  
**End**: Schedule end date and time.  

Attention! All times are UTC times.

Sample for scheduling two users:

```
Email,Start,End
ron@signl4.com,2021-06-30 14:00:00, 2021-06-30 15:00:00
john.doe@signl4.com,2021-06-39 14:00:00, 2021-06-30 16:00:00
```

Sample for deleting all schedules within a given range:

```
Email,Start,End
DELETE,2021-06-30 14:00:00, 2021-06-30 15:00:00
```
