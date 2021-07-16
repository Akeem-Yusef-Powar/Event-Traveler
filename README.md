# Project Overview
Event Traveler is a web application that tracks and visualizes a user’s trip on an interactive map that allows users to relive their experiences and share them with others. Event Traveler also has a social media aspect on it, where users can add family and friends so that they can view their trips, and everything they entail. When an individual initially visits Event Traveler, they’ll be prompted to register an account so they can be allowed to fully enter the site. Once logged in, a user will then be able to completely see and interact with all the pages available. The website will have several pages to give users multiple ways to enjoy all it has to offer. One page for example, is a featured trips page, where highly liked/saved trips can be viewed by users. Once one uploads their trip itinerary with photos, activities, and ratings, it will be added to the site for others to discover and explore on another page called the search trips page, or eventually the featured trips page. Looking at a specific trip's details page, it will include features such as a favoriting/saving system, observing photos at locations along the trip’s route, an events section to show what was done on the trip, a journals section to describe the events in the evnents section, and a comments section for users to leave feddback on photos and activities. Each trip created in an itinerary can also be updated whenever a user wants, allowing the ability to truly define what kind of a trip is being created and shared. These features, and others the site has to offer, allow users to not only re-experience trips in a much easier and convenient way, but also provide a way to share memories and photos from their trips quickly and efficiently. 

The website for Event Traveler is hosted on AWS (EC2). In terms of authentication and receiving notifications, the website uses Amazon Cognito and Amazon SNS. 

# Contributors
Andrew Pidhajny, Aathira Jayamohan, Adam Gasiewski, Behar Hoxha, Akeem Yusef-Powar, Lindsey Kathryn Burger


# Testing release link, Technical Support Lead Email, and Acceptance QA Testing Doc

Testing Release Link:
https://github.com/Capstone-Projects-2021-Spring/project-event-traveler/tree/webdev-v1.0.0

Email for QA Technical Support Lead: 
tuh20780@temple.edu

Acceptance QA Testing Doc:

https://drive.google.com/file/d/1ruTrrlWZGTbNTJoKSUkSqnQbfAy2ihUM/view?usp=sharing


# Test Procedures Documentation

Email for QA Technical Support Lead: tuh20780@temple.edu

TEST PORCEDURES DOCUMENT
Event Traveler

                          				     

 
REVISION HISTORY

Revision #	Author	Revision Date	Comments
1.0	 Aathira Jayamohan	 March . 4th  2021	initiated
1.0	 Adam Gasiewski	 March . 4th  2021	initiated
1.0	 Behar Hoxha	March . 4th  2021	initiated
1.0	 Andrew Pidhajny 	March . 4th  2021	initiated
1.0	 Akeem Yusef-Powar	March . 4th  2021	initiated
1.0	 Lindsey Kathryn Burger	March . 4th  2021	initiated



 
Table of Contents

Project Abstract	4
Features and Requirements 	4
Test Requirements                                                                                                                        5
Test Strategy                                                                                                                                  7


 
Project Abstract

Our project  proposes a novel web application that tracks and visualizes a user’s trip on an interactive map that allows users to relive their experiences and share them with others. Once one uploads their trip itinerary with photos, activities, and ratings, it can be added to a map for others to discover and explore. On the map, each trip will include features such as a favoriting/saving system, observing photos at locations along the trip’s route, and leaving comments on photos and activities. Each trip created in an itinerary, or uploaded, can be updated whenever a user wants as well, allowing the ability to truly define what kind of a trip is being created and shared.

Features and Requirements of the Project

Pre-Trip Planning

•	Event Traveler will have a user-friendly interface for easy navigation of the site on all devices.
•	Any errors will be met with notifications to the user.
•	Event Traveler will use AWS to host a server for the website and to store user data.
•	Users will be able to friend other users and follow their activity.
•	Users will be able to search for and explore through public trips posted on the site
•	Users will be able to filter search results by location, date, and more.
•	Users will have the ability to like and comment on key events from any trips they find.
•	Users will be able to save any trips they find and enjoy on the website.

Post-Trip Sharing

•	Users will be able to create their own trips which will include key events that can hold pictures, comments, relevant links, and likes for the key event and pictures added
•	Users will be able to create a personal account that will allow them to save their data. Data saved includes:
•	Saved trips from other users
•	Personal trips created 
•	Liked key events in trips
•	Comments on their personal trips 
•	Their friends list




 

Test Requirements

The listing below identifies those items (use cases, functional requirements, non-functional requirements) that have been identified as targets for testing. This list represents what will be tested. 
Data and Database Integrity Testing
Verify access to User  Database.
Verify simultaneous record read accesses.
Verify correct retrieval of update of database data.
System Testing (i.e. functional testing)
Verify Login Use Case 
Verify Close Registration Use Case 
Verify Maintain User Information Use Case 
Verify Submit review Use Case 
Verify View Trip Use Case 
Verify Sorting Trips Use Case 
Verify Create trips Use Case 
Verify “like” trip Use Case
Verify upload Picture Use case
Verify  Add Friends Use case
Verify remove Friend Use case 
Verify view Friends activity Use Case
Verify Save trips Use Case
Verify create a itinerary Use Case
Supplementary Specification: "All system errors shall be logged. Fatal system errors shall result in an orderly refresh of the website."
User Interface Testing
Verify ease of navigation through a sample set of screens.
Verify sample screens conform to GUI standards.
The System shall be easy-to-use 

Performance Testing

Verify response time to access personal information.
Verify response time to access trips
Verify response time for remote login.
Verify response time for creating a trip.
Load Testing
Verify system response when loaded a lot of users .
Verify system response when 10 simultaneous users access and make changes to the interactive map.
Stress Testing
Verify system response during maximum user logins.
Volume Testing
Verify system response when Database is at 90% capacity.
Security and Access Control Testing
Verify Logon from a local PC.
Verify Logon from a remote PC.
Verify Logon security through user name and password mechanisms.
5. Test Strategy
The Test Strategy presents the recommended approach to the testing of the software applications. The previous section on Test Requirements described what will be tested; this describes how it will be tested.
Below it is Use case of log in scenario .This type of testing will be executed to all the use cases as well.
Test Scenario ID	Login-1	Test Case ID	Login-1A
Test Case Description	Login – Positive test case	Test Priority	High
Pre-Requisite	A valid user account	Post-Requisite	NA
Test Execution Steps:
Action	Inputs	Expected Output	Actual Output	
Launch application	http://54.144.137.140:3000/
EventTravler
Home 	EvenTravler home	
Enter correct Email & Password and hit login button	Email id : test@xyz.com
Password: ******	Login success	Login success	





Test Scenario ID	Login-1	Test Case ID	Login-1B
Test Case Description	Login – Negative test case	Test Priority	High
Pre-Requisite	NA	Post-Requisite	NA
Test Execution Steps:
Action	Inputs	Expected Output	Actual Output
Launch application	https://evenTraveler.com
EvenTravler home	EvenTravler home
Enter invalid Email & any Password and hit login button	Email id : invalid@xyz.com
Password: ******	The email address or phone number that you've entered doesn't match any account. Sign up for an account.
	The email address or phone number that you've entered doesn't match any account. Sign up for an account.

Enter valid Email & incorrect Password and hit login button	Email id : valid@xyz.com
Password: ******	The password that you've entered is incorrect. Forgotten password?
	The password that you've entered is incorrect. Forgotten password?



Testing Types

1. Data and Database Integrity Testing
The databases and the database processes should be tested as separate systems. These systems should be tested without the applications (as the interface to the data). Additional research into the DBMS needs to be performed to identify the tools / techniques that may exist to support the testing identified below.
Test Objective:	Ensure Database access methods and processes function properly and without data corruption.
Technique:	•	Invoke each database access method and process, seeding each with valid and invalid data (or requests for data).
•	Inspect the database to ensure the data has been populated as intended, all database events occurred properly, or review the returned data to ensure that the correct data was retrieved (for the correct reasons)
Completion Criteria:	All database access methods and processes function as designed and without any data corruption.
Special Considerations:	•	Testing may require a DBMS development environment or drivers to enter or modify data directly in the databases.
•	Processes should be invoked manually.
•	Small or minimally sized databases (limited number of records) should be used to increase the visibility of any non-acceptable events.
2. System Testing
Testing of the application should focus on any target requirements that can be traced directly to use cases (or business functions), and business rules. The goals of these tests are to verify proper data acceptance, processing, and retrieval, and the appropriate implementation of the business rules. This type of testing is based upon black box techniques, that is, verifying the application (and its internal processes) by interacting with the application via the GUI and analyzing the output (results). Identified below is an outline of the testing recommended for each application:
 
Test Objective:	Ensure proper application navigation, data entry, processing, and retrieval.

Technique:	•	Execute each use case, use case flow, or function, using valid and invalid data, to verify the following:
•	The expected results occur when valid data is used.
•	The appropriate error / warning messages are displayed when invalid data is used.
•	Each business rule is properly applied.
Completion Criteria:	•	All planned tests have been executed.
•	All identified defects have been addressed.
Special Considerations:	•	Access to the Google Maps API needed to create the interactive map
3. User Interface Testing
User Interface testing verifies a user’s interaction with the software. The goal of UI Testing is to ensure that the User Interface provides the user with the appropriate access and navigation through the functions of the applications. In addition, UI Testing ensures that the objects within the UI function as expected and conform to corporate or industry standards.
 
Test Objective:	Verify the following:

•	Navigation through the application properly reflects business functions and requirements, including window to window, field to field, and use of access methods (tab keys, mouse movements, accelerator keys)
•	Window objects and characteristics, such as menus, size, position, state, and focus conform to standards.
Technique:	•	Create / modify tests for each window to verify proper navigation and object states for each application window and objects.
Completion Criteria:	Each window successfully verified to remain consistent with benchmark version or within acceptable standard
Special Considerations:	•	Not all properties for custom and third party objects can be accessed.
5. Performance Testing
Performance testing measures response times, transaction rates, and other time sensitive requirements. The goal of Performance testing is to verify and validate the performance requirements have been achieved. Performance testing is usually executed several times, each using a different "background load" on the system. The initial test should be performed with a "nominal" load, similar to the normal load experienced (or anticipated) on the target system. A second performance test is run using a peak load.
Additionally, Performance tests can be used to profile and tune a system’s performance as a function of conditions such as workload or hardware configurations.
NOTE: Transactions below refer to "logical business transactions." These transactions are defined as specific functions that an end user of the system is expected to perform using the application, such as add or modify a given contract.
 
Test Objective:	Validate System Response time for designated transactions or business functions under a the following two conditions:

- normal anticipated volume
- anticipated worse case volume
Technique:	•	Use Test Scripts developed for Business Model Testing (System Testing).
•	Modify data files (to increase the number of transactions) or modify scripts to increase the number of iterations each transaction occurs.
•	Scripts should be run on one machine (best case to benchmark single user, single transaction) and be repeated with multiple clients (virtual or actual, see special considerations below).
Completion Criteria:	•	Single Transaction / single user: Successful completion of the test scripts without any failures and within the expected / required time allocation (per transaction)
•	Multiple transactions / multiple users: Successful completion of the test scripts without any failures and within acceptable time allocation.
Special Considerations:	•	Comprehensive performance testing includes having a "background" load on the server. There are several methods that can be used to perform this, including:
o	"Drive transactions" directly to the server, usually in the form of SQL calls.
o	Create "virtual" user load to simulate many (usually several hundred) clients. Remote Terminal Emulation tools are used to accomplish this load. This technique can also be used to load the network with "traffic."
o	Use multiple physical clients, each running test scripts to place a load on the system.
•	Performance testing should be performed on a dedicated machine or at a dedicated time. This permits full control and accurate measurement.
•	The databases used for Performance testing should be either actual size, or scaled equally.
6. Load Testing
Load testing measures subjects the system-under-test to varying workloads to evaluate the system’s ability to continue to function properly under these different workloads. The goal of load testing is to determine and ensure that the system functions properly beyond the expected maximum workload. Additionally, load testing evaluates the performance characteristics (response times, transaction rates, and other time sensitive issues).

Test Objective:	Verify System Response time for designated transactions or business cases under varying workload conditions.

Technique:	
•	Modify data files (to increase the number of transactions) or the tests to increase the number of times each transaction occurs.
Completion Criteria:	•	Multiple transactions / multiple users: Successful completion of the tests without any failures and within acceptable time allocation.
Special Considerations:	•	Load testing should be performed on a dedicated machine or at a dedicated time. This permits full control and accurate measurement.
•	The databases used for load testing should be either actual size, or scaled equally.
7. Stress Testing
Stress testing is intended to find errors due to low resources or competition for resources. Low memory or disk space may reveal defects in the software that aren't apparent under normal conditions. Other defects might results from competition for shared resource like database locks or network bandwidth. Stress testing identifies the peak load the system can handle.

Test Objective:	Verify that the system and software function properly and without error under the following stress conditions:

•	little or no memory available on the server (RAM and DASD)
•	maximum (actual or physically capable) number of clients connected (or simulated)
•	multiple users performing the same transactions against the same data / accounts
•	worst case transaction volume / mix (see performance testing above).
NOTES: Stress testing’s goal might also be stated as identify and document the conditions under which the system FAILS to continue functioning properly.
Technique:	•	Use tests developed for Performance Testing.
•	To test limited resources, tests should be run on single machine, RAM and DASD on server should be reduced (or limited).
•	For remaining stress tests, multiple clients should be used, either running the same tests or complementary tests to produce the worst case transaction volume / mix.
Completion Criteria:	All planned tests are executed and specified system limits are reached / exceeded without the software or software failing (or conditions under which system failure occurs is outside of the specified conditions).
Special Considerations:	•	Stressing the network may require network tools to load the network with messages / packets.
•	The DASD used for the system should temporarily be reduced to restrict the available space for the database to grow.
•	Synchronization of the simultaneous clients accessing of the same records / data accounts.
8. Volume Testing
Volume Testing subjects the software to large amounts of data to determine if limits are reached that cause the software to fail. Volume testing also identifies the continuous maximum load or volume the system can handle for a given period. For example, if the software is processing a set of database records to generate a report, a Volume Test would use a large test database and check that the software behaved normally and produced the correct report.
Test Objective:	Verify that the application / system successfully functions under the following high volume scenarios:
•	maximum (actual or physically capable) number of clients connected (or simulated) all performing the same, worst case (performance) business function for an extended period.
•	maximum database size has been reached (actual or scaled) and multiple queries / report transactions are executed simultaneously.
Technique:	•	Use tests developed for Performance Testing.
•	Multiple clients should be used, either running the same tests or complementary tests to produce the worst case transaction volume / mix (see stress test above) for an extended period.
•	Maximum database size is created (actual, scaled, or filled with representative data) and multiple clients used to run queries / report transactions simultaneously for extended periods.
Completion Criteria:	All planned tests have been executed and specified system limits are reached / exceeded without the software or software failing.
Special Considerations:	•	What period of time would be considered an acceptable time for high volume conditions (as noted above)?
9. Security and Access Control Testing
Security and Access Control Testing focus on two key areas of security:
- Application security, including access to the Data or Business Functions, and
- System Security, including logging into / remote access to the system.
Application security ensures that, based upon the desired security, users are restricted to specific functions or are limited in the data that is available to them. For example, everyone may be permitted to enter data and create new accounts, but only managers can delete them. If there is security at the data level, testing ensures that user "type" one can see all customer information, including financial data, however, user two only sees the demographic data for the same client.
System security ensures that only those users granted access to the system are capable of accessing the applications and only through the appropriate gateways.
Test Objective:	Function / Data Security: Verify that user can access only those functions / data for which their user type is provided permissions.
System Security: Verify that only those users with access to the system and application(s) are permitted to access them.
Technique:	•	Function / Data Security: Identify and list each user type and the functions / data each type has permissions for.
•	Create tests for each user type and verify permission by creating transactions specific to each user type.
•	Modify user type and re-run tests for same users. In each case verify those additional functions / data are correctly available or denied.
•	System Access (see special considerations below)
Completion Criteria:	For each known user type the appropriate function / data are available and all transactions function as expected and run in prior Application Function tests
Special Considerations:	•	Access to the system must be reviewed / discussed with the appropriate network or systems administrator. This testing may not be required as it maybe a function of network or systems administration.
10. Configuration Testing
Configuration testing verifies operation of the software on different software and hardware configurations. In most production environments, the particular hardware specifications for the client workstations, network connections and database servers vary. Client workstations may have different software loaded (e.g. applications, drivers, etc.) and at any one time many different combinations may be active and using different resources.
 
Test Objective:	Validate and verify that the client Applications function properly on the prescribed client workstations.

Technique:	•	Use Integration and System Test scripts
•	Open / close various PC applications, either as part of the test or prior to the start of the test.
•	Execute selected transactions to simulate user activities into and out of various PC applications.
•	Repeat the above process, minimizing the available conventional memory on the client.
Completion Criteria:	For each combination transactions are successfully completed without failure.
Special Considerations:	•	What PC Applications are available, accessible on the clients?
•	What applications are typically used?
•	What data are the applications running (i.e. large spreadsheet opened in Excel, 100 page document in Word).
•	The entire systems, network servers, databases, etc. should also be documented as part of this test.




