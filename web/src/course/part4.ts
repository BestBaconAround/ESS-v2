import { f, q, type CourseModule } from './types'

const PART = 'Connected systems'

export const PART_4: CourseModule[] = [
  {
    id: 'communicator',
    part: PART,
    title: 'The communicator',
    intro: 'The WCM and the EMS-C, how they connect, what to check when a system is offline, and how to change the Wi-Fi.',
    pages: [57, 61],
    lessons: [
      {
        heading: 'Two communicators',
        facts: [
          f(57, 'A Sanctuary uses a WCM (the first one) or an EMS-C, never both. Sanctuary 3 systems were supplied only with the EMS-C.', 'The Sanctuary 3 systems were supplied only with the EMS-C'),
          f(57, 'The communicator is used to commission the system and to upload data to the cloud. Day to day it uploads through Wi-Fi or an Ethernet cable.', 'the communicator uploads the data to the cloud through WiFi or an Ethernet cable connection'),
          f(57, 'The WCM came with Sanctuary 2. WCM 2.0 added an Ethernet port. The inverter powers it through the communication cable. Pins: 1 = 5 V, 6 = GND, 7 = RS-485 A, 8 = RS-485 B.', 'The WCM is powered by the inverter through the communication cable'),
          f(58, 'The EMS-C does everything the WCM does, plus a cellular modem, a backup battery, more memory, a second RS-485 bus, a second CAN bus, USB, digital I/O and a power switch. The inverter powers it through the 12 V port.', 'The EMS-C is powered by the inverter through the 12V port'),
          f(58, 'With no Wi-Fi or Ethernet, the EMS-C tries cellular but only uploads alarms. Lion Energy can still reach it over cellular for troubleshooting.', 'it will try to connect to cellular but will only upload alarms'),
          f(58, 'The EMS-C battery port and inverter port RS-485 buses are separate. On Sanctuary 3 the battery port connects to battery #1 COM1 in normal operation.', 'The battery port RS-485 bus and the inverter port RS-485 bus are separate, different busses'),
        ],
      },
      {
        heading: 'Wiring',
        facts: [
          f(59, 'Sanctuary 2 rev 3 uses a special flat cable from the meter port to the WCM. A standard Ethernet cable will not work, and a cable tester will flag the right cable as wrong.', 'A standard Ethernet cable won\'t work'),
          f(60, 'Sanctuary 3: the EMS-C inverter port goes to the parent inverter\'s PARALLEL A port. The parent\'s PARALLEL B goes to the next inverter\'s PARALLEL A.', 'The inverter port on the EMS-C connects to the parent inverter\'s PARALLEL A port'),
        ],
      },
      {
        heading: 'Offline, and changing the Wi-Fi',
        facts: [
          f(60, 'Offline (no data on smart.lionenergy.com): check that the inverter and communicator are both powered on.', 'Check to make sure the inverter and communicator are both powered on'),
          f(60, 'If it cannot reach Wi-Fi, check the antennas. The one labeled cellular goes on the cellular port. The Wi-Fi port takes the one labeled WiFi/Bluetooth. The wrong one gives poor reception.', 'The antenna labeled cellular should connect to the cellular port on the EMS-C'),
          f(60, 'Changing the Wi-Fi SSID or password always needs local access, within Bluetooth range of the Sanctuary.', 'local access within Bluetooth range of the Sanctuary is required to change the WiFi SSID/password'),
          f(61, 'Installers can change it in the Lion Technician app under Select Service > "Change or Reconnect Network". On a laptop with Bluetooth: smart.lionenergy.com > the product page > settings > change internet.', 'Select Service > "Change or Reconnect Network"'),
          f(61, 'A hard-wired Ethernet connection to a router is the most reliable.', 'This is the most reliable connection'),
        ],
      },
    ],
    questions: [
      q(57, 'Which communicator did Sanctuary 3 systems ship with?', 'Only the EMS-C', ['Only the WCM', 'Either one, chosen by the installer', 'Both, working together'], 'The Sanctuary 3 systems were supplied only with the EMS-C'),
      q(57, 'How is the WCM powered?', 'By the inverter, through the communication cable', ['By its own backup battery', 'Through the inverter\'s 12 V port', 'By a USB charger plugged into the router'], 'The WCM is powered by the inverter through the communication cable'),
      q(58, 'How is the EMS-C powered?', 'By the inverter, through the 12 V port', ['Through the communication cable at 5 V', 'By its backup battery alone', 'By the grid port circuit breaker'], 'The EMS-C is powered by the inverter through the 12V port'),
      q(58, 'An EMS-C has neither Wi-Fi nor Ethernet. What does it do?', 'It tries cellular, but only uploads alarms', ['It uploads all data over cellular', 'It stops all uploading until the cable is back', 'It switches to uploading over Bluetooth'], 'it will try to connect to cellular but will only upload alarms'),
      q(59, 'What cable connects the meter port to the WCM on a Sanctuary 2 rev 3?', 'A special flat cable. A standard Ethernet cable will not work', ['Any standard Ethernet cable will do', 'A USB to RS-485 adapter cable', 'A coaxial antenna cable'], 'A standard Ethernet cable won\'t work'),
      q(60, 'On Sanctuary 3, which EMS-C port connects to the parent inverter\'s PARALLEL A port?', 'The inverter port', ['The battery port', 'The USB port', 'The Ethernet port'], 'The inverter port on the EMS-C connects to the parent inverter\'s PARALLEL A port'),
      q(60, 'Which antenna goes on the EMS-C cellular port?', 'The antenna labeled cellular', ['The antenna labeled WiFi/Bluetooth', 'Either one, they are the same', 'Neither: the cellular port needs no antenna'], 'The antenna labeled cellular should connect to the cellular port on the EMS-C'),
      q(60, 'What do all the methods of changing the Wi-Fi SSID or password require?', 'Local access within Bluetooth range of the Sanctuary', ['An Ethernet cable plugged into the EMS-C', 'Technician access on the account', 'A working cellular connection'], 'local access within Bluetooth range of the Sanctuary is required to change the WiFi SSID/password'),
      q(61, 'Where in the Lion Technician app do installers change the Wi-Fi?', 'Select Service > "Change or Reconnect Network"', ['Settings > Advanced > Network', 'Commissioning > Wi-Fi setup', 'Service > Reset Communicator'], 'Select Service > "Change or Reconnect Network"'),
      q(61, 'Which internet connection is the most reliable?', 'Hard-wired Ethernet to a router', ['Wi-Fi on the 2.4 GHz band', 'Cellular through the EMS-C', 'Bluetooth through a phone'], 'This is the most reliable connection'),
    ],
  },
  {
    id: 'solar',
    part: PART,
    title: 'Solar',
    intro: 'The voltage window, the cold-weather calculation, reversed polarity, ground leakage, rapid shutdown, grid limits and AC solar.',
    pages: [61, 65],
    lessons: [
      {
        heading: 'Voltage',
        facts: [
          f(61, 'The MPPT operating voltage is 120 V to 500 V. It needs at least 120 V DC to start, and the open-circuit voltage must never exceed 500 V. Much higher may damage the inverter.', 'The Sanctuary MPPT requires at least 120V DC to start operation'),
          f(62, 'Voc rises as it gets colder. So the installer works out the string\'s maximum voltage at the coldest temperature.', 'This also means that Voc increases when temperature decreases'),
          f(62, 'Worked example: 48.2 V Voc per panel, 10 in series = 482 V at 25 °C.', 'that would be 48.2V x 10 panels = 482V'),
          f(63, 'Margin: 500 - 482 = 18 V, which is 3.73%. With a coefficient of -0.29% per degree, that is 12.87 degrees colder, so under 12 °C the string goes over 500 V in full sun.', 'So at temperatures under 12'),
          f(63, 'With 9 panels (433.8 V) the limit is -27.6 °C.', '48.2V x 9 panels = 433.8V'),
        ],
      },
      {
        heading: 'Polarity and ground leakage',
        facts: [
          f(63, 'About -1 V from PV1+ to PV1- means the PV lines are reversed.', 'If the voltage from PV1+ to PV1- is approximately -1 V, the PV lines are reversed'),
          f(63, 'Water in a panel can leak to ground. The inverter shuts down when it detects ground current, often during or after rain. Rev 4 and Sanctuary 3 have fuses on the MPPT inputs.', 'the inverter will shut down when ground current is detected'),
          f(63, 'On a ground fault alarm, check the panels for cracked glass, condensation or water spots inside, or physical damage.', 'check the solar panels for cracked glass, condensation or water spots inside the panels, or physical damage'),
          f(64, 'Measure ground current with a clamp-on DC ammeter (1 mA resolution preferred). Clamp the string\'s positive and negative leads together: the flows cancel and what remains is the ground leakage. It may not show up until it rains again.', 'if both the positive and negative lead of the string are measured at the same time, the current flow in opposite directions will cancel each other out'),
        ],
      },
      {
        heading: 'Rapid shutdown, grid limits and AC solar',
        facts: [
          f(64, 'The Sanctuary does not include any RSD transmitters. Forgetting to install one for the MLPEs is a common problem, and the transmitter must be compatible with the MLPE.', 'The Sanctuary does not include any RSD transmitters'),
          f(65, 'Turning off the PV Disconnect does not turn off 12 V power to the RSD transmitter. With radio-signal MLPE, the PV lines stay energized when the PV Disconnect is off.', 'then the PV lines will still be energized when the PV Disconnect switch is off'),
          f(65, 'Grid overvoltage cuts sell-back: reduced at about 106% of nominal, and to zero at 110%. Above 60.036 Hz sell-back must also be reduced.', 'At 110% of nominal voltage, sell-back power must be reduced to zero'),
          f(65, 'AC solar goes into the generator port. The AC solar inverter must be grid following. An off-grid inverter cannot be used. If the port reads 240 V AC, it is ready.', 'The AC solar inverter must be grid following'),
          f(65, 'Sanctuary 2 revs 1 and 2 have no internal CT on the generator port, so AC solar power is not tracked. Later versions track it.', 'Sanctuary 2 revs 1 & 2 do not have an internal CT on the generator port'),
        ],
      },
    ],
    questions: [
      q(61, 'What is the minimum DC voltage the Sanctuary MPPT needs to start?', '120 V', ['48 V', '250 V', '500 V'], 'The Sanctuary MPPT requires at least 120V DC to start operation'),
      q(61, 'What must the maximum open-circuit voltage not exceed?', '500 V', ['400 V', '600 V', '1000 V'], 'The maximum open circuit voltage must not exceed 500V'),
      q(62, 'Each panel has a Voc of 48.2 V. What is the string voltage of 10 panels in series at 25 °C?', '482 V', ['241 V', '500 V', '964 V'], 'that would be 48.2V x 10 panels = 482V'),
      q(63, 'In the worked example, at what temperature does the 10-panel string go over 500 V?', 'Under about 12 °C', ['Under about -28 °C', 'Under about 25 °C', 'Only above about 40 °C'], 'So at temperatures under 12'),
      q(63, 'The voltage from PV1+ to PV1- reads about -1 V. What does that mean?', 'The PV lines are connected backwards', ['The string is open circuit', 'There is a ground fault on the string', 'It is a normal reading in sunlight'], 'If the voltage from PV1+ to PV1- is approximately -1 V, the PV lines are reversed'),
      q(63, 'A ground fault alarm appears after rain. What should you check?', 'The panels for cracked glass, condensation or water spots inside, or physical damage', ['The MPPT fuses first, then the CT orientation', 'The battery addresses on the RS-485 bus', 'The generator charge current setting'], 'check the solar panels for cracked glass, condensation or water spots inside the panels, or physical damage'),
      q(64, 'How do you measure ground leakage current with a clamp-on DC ammeter?', 'Clamp the string\'s positive and negative leads together, and the remainder is the leakage', ['Clamp only the positive lead of the string', 'Clamp the case ground and the neutral together', 'Clamp each lead separately and add the readings'], 'if both the positive and negative lead of the string are measured at the same time, the current flow in opposite directions will cancel each other out'),
      q(64, 'Does the Sanctuary include a rapid shutdown transmitter?', 'No. The installer must add one that is compatible with the MLPE', ['Yes, one is built into the inverter', 'Yes, but only on Sanctuary 3', 'Only when AC solar is connected'], 'The Sanctuary does not include any RSD transmitters'),
      q(65, 'At what grid voltage must sell-back be reduced to zero?', '110% of nominal', ['102% of nominal', '106% of nominal', '115% of nominal'], 'At 110% of nominal voltage, sell-back power must be reduced to zero'),
      q(65, 'Which Sanctuary port accepts another solar inverter\'s 240 V AC output?', 'The generator port', ['The grid port', 'The load port', 'The PV1 input'], 'The Sanctuary can be configured to accept another solar inverter\'s 240V AC output at the Sanctuary\'s generator port'),
      q(65, 'Which Sanctuary 2 revisions do not track AC solar power?', 'Revs 1 and 2', ['Revs 3 and 4', 'Rev 4 only', 'All Sanctuary 2 revisions'], 'Sanctuary 2 revs 1 & 2 do not have an internal CT on the generator port'),
    ],
  },
  {
    id: 'generator',
    part: PART,
    title: 'Generator',
    intro: 'How the Sanctuary uses a generator, auto-start problems, and the generator-as-grid setting.',
    pages: [66, 67],
    lessons: [
      {
        heading: 'How it works',
        facts: [
          f(66, 'On generator power the generator connects internally to the load port, and the voltage and frequency come from the generator.', 'the generator connects internally to the load port of the Sanctuary'),
          f(66, 'In a parallel system the generator must be connected to each inverter.', 'The generator needs to be connected to each inverter in parallel inverter systems'),
          f(66, 'With solar also running, the inverter will not charge the battery faster than the generator battery charge current setting.', 'the inverter will not charge the battery any faster than the generator battery charge current setting'),
          f(66, 'The Sanctuary will not accept generator power while it is connected to the grid. That keeps a grid-forming generator from connecting to the grid.', 'The Sanctuary will not accept generator power when the Sanctuary is connected to the grid'),
        ],
      },
      {
        heading: 'Auto-start and manual start',
        facts: [
          f(66, 'With auto-start enabled, the Sanctuary commands the generator on when it is off-grid and the battery is below the start SoC. It turns it off when a stop condition is met.', 'the Sanctuary will command the generator to turn on when off-grid and the battery is below the start SoC'),
          f(66, 'Auto-start not working: measure the voltage on the two-wire start wires. 0 V means the inverter\'s generator relay is on, or the generator is not ready to run.', 'If it\'s zero volts, then either the inverter\'s generator relay is on, or the generator is not ready to run'),
          f(66, 'Generator keeps running after the inverter stops the start signal: unplug the two-wire start. If the generator stops, the TVS diode may be leaking. It was removed in later Sanctuary 2 rev 4 and Sanctuary 3 inverters.', 'The TVS diode has been removed in later Sanctuary 2 rev4 and Sanctuary 3 inverters'),
          f(66, 'Manual start: if the generator is enabled, the inverter accepts generator power off-grid when voltage and frequency are inside the window in the settings.', 'the inverter will accept generator power when offgrid and generator voltage and frequency are within the window defined in the settings'),
        ],
      },
      {
        heading: 'Generator as grid',
        facts: [
          f(66, 'When "generator as grid" is selected the generator port is not used. It is only for off-grid installations that never connect to the grid.', 'This setting is exclusively for off-grid installations that don\'t connect to the grid'),
          f(67, 'The advantage: the Sanctuary can be dark started from the generator on the grid port, and the grid port supports more current.', 'The grid port can also support more current than the generator port'),
        ],
      },
    ],
    questions: [
      q(66, 'When will the Sanctuary not accept generator power?', 'When it is connected to the grid', ['When the battery is above 50% charged and nearly full', 'When solar is producing more than the loads use', 'When it is in battery priority (emergency) mode'], 'The Sanctuary will not accept generator power when the Sanctuary is connected to the grid'),
      q(66, 'In a parallel inverter system, which inverters does the generator connect to?', 'Each inverter', ['The parent inverter only', 'The last child inverter only', 'None: it connects to the EMS-C'], 'The generator needs to be connected to each inverter in parallel inverter systems'),
      q(66, 'With generator and solar both running, what limits how fast the battery charges?', 'The generator battery charge current setting', ['The grid charge current setting in the app', 'The inverter\'s MPPT current limit per string', 'The battery breaker rating of 250 A'], 'the inverter will not charge the battery any faster than the generator battery charge current setting'),
      q(66, 'Auto-start is not working and the two-wire start wires read 0 V. What could be true?', 'The inverter\'s generator relay is on, or the generator is not ready to run', ['The generator\'s fuel tank is empty or its fuel valve is shut', 'The CTs are on the wrong lines and read backwards', 'The grid breaker is on and the inverter is on the grid'], 'If it\'s zero volts, then either the inverter\'s generator relay is on, or the generator is not ready to run'),
      q(66, 'The generator keeps running, but unplugging the two-wire start stops it. What may be leaking?', 'The TVS diode', ['The battery breaker', 'The grid relay', 'The MPPT fuse'], 'If that shuts off the generator, then the TVS diode may be leaking enough current to signal the generator to start'),
      q(66, 'Which inverters had the TVS diode removed?', 'Later Sanctuary 2 rev 4 and Sanctuary 3 inverters', ['Sanctuary 2 rev 1 and rev 2 inverters only', 'Every Sanctuary 2 revision but not Sanctuary 3', 'No inverter, because it is still fitted to all of them'], 'The TVS diode has been removed in later Sanctuary 2 rev4 and Sanctuary 3 inverters'),
      q(66, 'What is the "generator as grid" setting for?', 'Off-grid installations that never connect to the grid', ['Parallel systems with three inverters on a three-phase service', 'Systems with AC solar coupled on the generator port', 'Sanctuary 2 rev 1 and rev 2 inverters only'], 'This setting is exclusively for off-grid installations that don\'t connect to the grid'),
      q(67, 'What is an advantage of connecting the generator to the grid port?', 'The Sanctuary can be dark started from it, and the port supports more current', ['It lets the generator and the grid run together at the same time', 'It removes the need for the CTs and the transfer switch', 'It charges the batteries directly without going through the inverter'], 'The grid port can also support more current than the generator port'),
    ],
  },
]
