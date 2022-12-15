# CoTra
## Project realized by a team of students from Politecnico di Milano

### Author: Giulia Carpani, Filippo Castellani, Orith Halfon, Stefano Vannoni, Elisabetta Marini



## What does it do ?
It estimates the cross spectrum using the Welch method between any two given signals.

## Scope: 
This module was created to work in the broader context of [Python for OpenVibe][1] (OV).


## What software does it require ?
 - Python 3.0 (following modules: math, numpy, scipy, pandas, PySimpleGUI).
 - Any version of OV supporting Python 3.0 Scripting boxes (>= 3.0.0).


## Example scenario:
A template scenario is available [here][4].

## Box configuration in OpenVibe
1. Drop a new Scripting Box in your scenario.  
![plain_scripting_box]
2. Add the script filepath by double-clicking on the box and using the file explorer.  
![script_path_selection]  
3. Add a Signal input.  
![adding_input]  
![signal_input]
4. Add a Signal output.
5. Add a Streamed Matrix output. 

This should be the final configuration  
![scripting_box]

#### INPUT
1. Inputs are in the form of OV's Signal Stream. Each stream contains many signals.
2. The box also requires as input an _.xlsx_ file who's path is customizable by modifying the python script. This holds information about which of the signal should be used in the estimation of the cross-spectrum and which frequency is required as the box output. 

#### OUTPUT
The exact same output is produced as Streamed Matrix or Signal, that is for data formatting purposes. It could be useful to have one or the other depending on the way you wish to visualize and handle the output data.

### Structure:
In this module, two classes are defined:

1. MyOVBox This class inherits from OVBox class put at disposal by OV
2. MyCXYBox This class is specifically built for real-time computing the cross-spectral feature needed for the BCI functioning

An in-depth description of the module can be found [here][3] in the form of HTML document.

[script_path_selection]:CXY_V4_1_Documentation/script_path_selection.jpg
[adding_input]:CXY_V4_1_Documentation/adding_input.jpg
[plain_scripting_box]:CXY_V4_1_Documentation/plain_scripting_box.jpg
[signal_input]:CXY_V4_1_Documentation/signal_input.jpg
[scripting_box]:CXY_V4_1_Documentation/scripting_box.jpg

[1]:http://openvibe.inria.fr/tutorial-using-python-with-openvibe
[2]:https://www.hsantalucia.it/laboratorio-immagini-neuroelettriche-interfacce-cervello-computer#progetti
[3]:https://drive.google.com/open?id=145ATLOw7r9rYj0JriDOC_v3jlqio4tr5&authuser=castellani.1859189%40studenti.uniroma1.it&usp=drive_fs
[4]:https://drive.google.com/drive/folders/14m0gmt842UMO8kF4iE6ZSdVLp3WiSMTP?usp=sharing
