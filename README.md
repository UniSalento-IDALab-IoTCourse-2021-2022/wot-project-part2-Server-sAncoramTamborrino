# wot-project-part2-Server-sAncoramTamborrino
wot-project-part1-samueleancora created by GitHub Classroom

AN EDGE COMPUTING SOLUTION FOR DRIVER'S SAFETY

The aim of the project is to guarantee and monitor driver's life signals as well as inspect the environment inside the vehicle and manage it. To do so, the Edge Computing paradigm has been chosen to satisfy requirements in speed of elaboration and low delay. The system is composed of three main components: the edge, the server and the frontend.

The first component consists of a Raspeberry Pi 4 and the sensors. Its repository can be found at this address:https://github.com/UniSalento-IDALab-IoTCourse-2021-2022/wot-project-part1-EdgeDevice-sAncoramTamborrino/blob/master/README.md

The second component consists of the server, which is in charge to use machine learning to create a model based on data sent by the edge and to store them in a NoSQL database, MongoDB. In this repository it can be found the respective code.

The third component consists of the frontend page, where an external user can access to the digital twins of both driver and car, and get notified of occurred events. Its repository can be reach at this address:https://github.com/UniSalento-IDALab-IoTCourse-2021-2022/wot-project-part3-FrontEnd-sAncoramTamborrino

To give a better understanding of the architecture of the system, the following picture is attached.


![iotarch](https://user-images.githubusercontent.com/106089600/202003221-f3a556e3-e22e-4b43-8f91-3e7255d2c3a8.png)
