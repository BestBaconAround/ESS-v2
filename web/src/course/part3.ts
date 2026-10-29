import { f, q, type CourseModule } from './types'

const PART = 'Power and testing'

export const PART_3: CourseModule[] = [
  {
    id: 'load-power-and-grid',
    part: PART,
    title: 'Load power off, and connecting to the grid',
    intro: 'Why the backup panel loses power, and the checklist for an inverter that will not connect to the grid.',
    pages: [32, 34],
    lessons: [
      {
        heading: 'Load power is off',
        facts: [
          f(32, 'Lion Energy recommends a transfer (bypass) switch so backup loads can run from the grid when the Sanctuary needs service. The load port must never have an external connection to the grid.', 'the load port must never have an external connection to the grid'),
          f(32, 'If the backup panel stays dead in an outage, check the bypass switch. It may need to be on the inverter position.', 'It may need to be switched to the inverter position'),
          f(32, 'Off-grid, at 10% battery the inverter shuts off the load port. It keeps its control board on so the rapid shutdown transmitter has 12 V and solar can charge again.', 'When off-grid and the battery gets down to 10%, the inverter shuts off the load port'),
          f(32, 'The load port resumes after the batteries charge to 20%, which is 10% above the off-grid depth of discharge.', 'After charging the batteries up to 20%'),
          f(32, 'A remote shutdown switch is in series with the AC/DC power button. If either is open, the load port and the 12 V to the RSD transmitter turn off.', 'This switch is in series with the AC/DC power button on the side of the inverter'),
          f(32, 'In a parallel system, if any inverter\'s AC/DC button or any remote shutdown switch is off, all inverters turn off.', 'if any inverter\'s AC/DC button is off or any remote shutdown switch is off, all inverters will turn off'),
          f(32, 'With a BMS communication failure the Sanctuary will not charge the batteries or run the inverter from them. Off-grid, the load port has no power.', 'The Sanctuary will not charge the batteries or power the AC inverter from the batteries if there is a BMS communication failure'),
        ],
      },
      {
        heading: 'It will not connect to the grid',
        facts: [
          f(33, 'Before reconnecting, the inverter shows a grid low frequency alarm and a grid low voltage alarm. Check the alerts: they should say why it is not connecting.', 'The alarms should indicate why it\'s not connecting to the grid'),
          f(33, 'Status "off-grid PL" means the inverter is starting load-to-grid phase lock and getting ready to connect.', 'the inverter is initiating load to grid phase-lock and getting ready to connect to the grid'),
          f(33, 'Too high: the default max reconnect voltage is 105% of normal, or 126 V. Try enabling HVRT. If it is consistently over 126 V on either leg, call ESS support.', 'The default max grid reconnect voltage is 105% of normal, or 126V'),
          f(33, 'Too low: the inverter waits five minutes (default) for the voltage to stay between 91.7% and 105% of normal. Try enabling LVRT. Consistently under 110 V: call ESS support.', 'The inverter will wait five minutes (default) for the grid voltage to remain between 91.7% and 105% of normal'),
          f(34, 'Split phase is 120 V line to neutral and 240 V line to line. About 208 V line to line with 120 V on L1 and L2 means a three-phase service.', 'If line-to-line voltage reads about 208V when L1 and L2 read 120V, then it\'s a threephase service'),
          f(34, 'Default settings will not connect above 60.1 Hz or below 59.5 Hz.', 'If the grid frequency > 60.1 Hz, the default settings do not allow connecting to the grid'),
          f(34, 'Parallel systems: every load combiner breaker and grid breaker must be on, with matching phasing on both sides. A wiring alarm persists until the inverter is completely shut down.', 'A wiring alarm will persist until the inverter is completely shut down'),
          f(34, 'The remote shutdown switch, AC/DC switch and Complete System Shutdown switch must all be closed. 5 V DC at the remote shutdown terminal means that switch is open.', 'If the terminal for the remote shutdown switch reads 5V DC, the switch is open'),
          f(34, 'The default Grid Reconnection Delay is 300 s. The minimum workable setting is 33 s.', 'The default setting for "Grid Reconnection Delay" is 300s'),
        ],
      },
    ],
    questions: [
      q(32, 'Off-grid, at what battery level does the inverter shut off the load port?', '10%', ['5%', '20%', '30%'], 'When off-grid and the battery gets down to 10%, the inverter shuts off the load port'),
      q(32, 'After the load port shuts off, at what battery level does it resume?', '20%', ['10%', '30%', '50%'], 'After charging the batteries up to 20%'),
      q(33, 'What is the default max grid reconnect voltage?', '105% of normal, or 126 V', ['100% of normal, or 120 V', '110% of normal, or 132 V', '95% of normal, or 114 V'], 'The default max grid reconnect voltage is 105% of normal, or 126V'),
      q(34, 'L1 and L2 each read 120 V, and line to line reads about 208 V. What does that tell you?', 'It is a three-phase service', ['The grid voltage is too low', 'A CT is reversed', 'The load ports are shorted together'], 'If line-to-line voltage reads about 208V when L1 and L2 read 120V, then it\'s a threephase service'),
      q(34, 'Above what grid frequency do the default settings refuse to connect?', '60.1 Hz', ['60.5 Hz', '61.0 Hz', '59.5 Hz'], 'If the grid frequency > 60.1 Hz, the default settings do not allow connecting to the grid'),
      q(34, 'What is the default Grid Reconnection Delay?', '300 s', ['33 s', '60 s', '900 s'], 'The default setting for "Grid Reconnection Delay" is 300s'),
      q(34, 'The remote shutdown terminal reads 5 V DC. What does that mean?', 'The remote shutdown switch is open', ['The switch is closed and working', 'The inverter is on the grid', 'The battery is full'], 'If the terminal for the remote shutdown switch reads 5V DC, the switch is open'),
      q(32, 'An off-grid Sanctuary has a BMS communication failure. What does the load port have?', 'No power', ['Power from solar only', 'Power from the grid through bypass', 'Power at reduced voltage'], 'When off-grid, the load port will have no power when there is a BMS communication failure'),
      q(32, 'In a parallel system, one inverter\'s AC/DC button is off. What happens?', 'All the inverters turn off', ['Only that inverter turns off', 'The others carry on as a smaller system', 'The child inverters take over as parent'], 'if any inverter\'s AC/DC button is off or any remote shutdown switch is off, all inverters will turn off'),
      q(32, 'What must the load port never have?', 'An external connection to the grid', ['A transfer switch in front of it', 'A breaker panel behind it', 'A connection to the backed-up loads'], 'the load port must never have an external connection to the grid'),
    ],
  },
  {
    id: 'power-buttons',
    part: PART,
    title: 'Power button testing',
    intro: 'Working out whether the inverter will not turn on because of a power button, a remote shutdown switch or something else.',
    pages: [34, 44],
    lessons: [
      {
        heading: 'Which switch is it?',
        facts: [
          f(34, 'Before replacing either switch, turn off all power to the inverter: grid, solar and battery.', 'Before replacing either switch, be sure to turn off all power to the inverter including grid, solar, and battery'),
          f(35, 'Sanctuary 2: the AC/DC on/off button has two switches (AC power and 12 V RSD power). The Complete System Shutdown button has three.', 'The "Complete System Shutdown" button has three switches'),
          f(35, 'The AC/DC button, the Complete System Shutdown button and the remote shutdown switch are all in series for AC power. All three must be on.', 'All three must be turned on for the inverter\'s AC power to turn on'),
          f(35, 'If only an AC power switch is bad, the controller turns on, you can communicate, and the front green LED flashes.', 'In that case, the front panel green LED will be flashing'),
          f(35, 'If the fault is in the switches behind Complete System Shutdown, the LED stays off and you cannot communicate with the inverter.', 'the LED on the front panel won\'t turn on and you won\'t be able to communicate with the inverter'),
        ],
      },
      {
        heading: 'Measuring it',
        facts: [
          f(36, 'Sanctuary 3: probe the DRY1_1B plug. 5 V means one or both side buttons are off or not connecting. 0 V: check the remote shutdown port, DRY1_1A.', 'If the measurement is 5V, then one or both of the power buttons on the side is off or not connecting'),
          f(36, 'The remote shutdown port ships with a wire loop from the factory. If its terminal reads 5 V, the remote shutdown switch is an open circuit.', 'The remote shutdown port comes with a wire loop installed from the factory'),
          f(37, 'If the voltage goes to zero with the button pressed all the way in but returns to 5 V when left on, the button has a mechanical problem.', 'then the button has a mechanical problem'),
          f(37, 'Sanctuary 3: reach the top button by removing the top panel (Lion logo and LEDs). A cable runs between that panel and the control board, so take care.', 'Be careful because there\'s a cable attached between the front panel and the control board'),
          f(39, 'Only on Sanctuary 2 rev 4 (not Sanctuary 3): 12 V for the EMS-C and RSD comes through the top button.', 'On Sanctuary 2 rev4 (but not on Sanctuary 3), 12V power for the EMS-C / RSD 12V comes through the top button'),
          f(42, 'Control board switch: unplug the two-wire cable CN13 (SB7 and SB8). With the bottom button on, continuity should be close to zero ohms.', 'If the bottom button is on, you should get close to zero Ohms'),
          f(42, 'Battery power switch: with the bottom button on, the voltage from the third wire down in the connector to the inverter\'s positive battery terminal should be close to zero volts.', 'When the bottom button is on, you should get close to zero volts'),
        ],
      },
    ],
    questions: [
      q(34, 'Before replacing either power switch, what must you do?', 'Turn off all power to the inverter, including grid, solar and battery', ['Turn off the grid breaker and leave solar and battery connected', 'Put the system in emergency mode first', 'Unplug the communicator and the EMS-C only'], 'Before replacing either switch, be sure to turn off all power to the inverter including grid, solar, and battery'),
      q(35, 'How many switches are in the Sanctuary 2 "Complete System Shutdown" button?', 'Three switches', ['One switch', 'Two switches', 'Four switches'], 'The "Complete System Shutdown" button has three switches'),
      q(35, 'Only one of the AC power switches is bad. What do you see?', 'The controller turns on and the front green LED flashes', ['No LEDs light up and there is no communication at all', 'A solid red LED and the inverter shuts down', 'A solid green LED and the system runs normally'], 'In that case, the front panel green LED will be flashing'),
      q(35, 'The LED stays off and you cannot communicate with the inverter. Where is the fault likely to be?', 'In the switches behind the Complete System Shutdown button', ['In the remote shutdown switch wired to the DRY1_1A port', 'In the AC/DC on/off button on the side of the unit', 'In the grid breaker supplying the grid port'], 'the LED on the front panel won\'t turn on and you won\'t be able to communicate with the inverter'),
      q(36, 'On Sanctuary 3 you probe the DRY1_1B plug and read 5 V. What does that mean?', 'One or both power buttons on the side are off or not connecting', ['The remote shutdown switch has a short circuit in its wiring', 'The battery is fully charged and the BMS has stopped charging', 'The grid voltage is out of range for the inverter'], 'If the measurement is 5V, then one or both of the power buttons on the side is off or not connecting'),
      q(37, 'The voltage goes to zero when you press the button in, but returns to 5 V when you leave it on. What is wrong?', 'The button has a mechanical problem', ['The remote shutdown switch has an open circuit', 'The control board has failed and needs replacing', 'The inverter has no input power from any source'], 'then the button has a mechanical problem'),
      q(39, 'Which inverter gets 12 V for the EMS-C and RSD through the top button?', 'Sanctuary 2 rev 4, but not Sanctuary 3', ['Sanctuary 3 only, and not Sanctuary 2 rev 4', 'Both Sanctuary 2 rev 4 and Sanctuary 3', 'Sanctuary 2 rev 1 and rev 2 only'], 'On Sanctuary 2 rev4 (but not on Sanctuary 3), 12V power for the EMS-C / RSD 12V comes through the top button'),
      q(42, 'With the bottom button on, what should you measure across the CN13 control board switch wires?', 'Close to zero ohms', ['About 5 V DC across the two wires', 'OL, an open circuit between the wires', 'About 12 V DC across the two wires'], 'If the bottom button is on, you should get close to zero Ohms'),
    ],
  },
  {
    id: 'relay-and-igbt-tests',
    part: PART,
    title: 'Relay and IGBT tests',
    intro: 'Checking relays for welded contacts on Sanctuary 2 and 3, and testing the IGBTs on a Sanctuary 2.',
    pages: [45, 54],
    lessons: [
      {
        heading: 'Sanctuary 2 relays',
        facts: [
          f(45, 'It has grid relays and load relays. The load relays are on the I/O board under the lower cover: line 1 on the left, line 2 on the right.', 'The line 1 load relay is the one on the left'),
          f(45, 'Check volts before continuity. With the inverter off the load relays should be open. Continuity across the terminals above a load relay means its contacts are welded closed.', 'its terminals are welded together'),
          f(46, 'Grid relay: with the grid breakers off, you should get an open circuit between the "LOAD relay in" terminal and the grid port.', 'If you turn off the grid breakers to the inverters, you should get an open circuit between the two terminals circled in red above'),
          f(47, 'EPS relays (top cover off): with the inverter off, INV1- to "LOAD1 relay in", and INV2- to "LOAD2 relay in", should be open.', 'When off, INV1- to "LOAD1 relay in" should be open'),
          f(48, 'Generator relays: with the inverter off, GEN L1 to "LOAD1 relay in", and GEN L2 to "LOAD2 relay in", should be open.', 'When off, GEN L1 to "LOAD1 relay in" should be open'),
        ],
      },
      {
        heading: 'Sanctuary 3 relays',
        facts: [
          f(48, 'Sanctuary 3 does not have load relays.', 'Unlike Sanctuary 2, Sanctuary 3 does not have load relays'),
          f(48, 'Grid relay, inverter on: turn off the grid breaker (all of them in a parallel system). The load port should read 120 V on L1, 120 V on L2 and 240 V between. 120 V to N at a grid port means the grid relay is stuck closed.', 'If either of the grid ports has 120V to N, the grid relay is stuck closed'),
          f(48, 'Grid relay, inverter off: it should be an open circuit, roughly 2 M ohms. Close to 0 ohms means it is stuck closed.', 'It should be open circuit, roughly 2M Ohms'),
          f(49, 'EPS relays, inverter off: the tested pairs for L1, L2 and N should all read open circuit.', 'When the inverter is off, we should get an open circuit between the two terminals circled in red'),
          f(50, 'Generator relays: with the inverter off they should be open.', 'When the inverter is off, the generator relays should be open'),
        ],
      },
      {
        heading: 'IGBT testing (Sanctuary 2)',
        facts: [
          f(51, 'A failed IGBT can conduct enough to make a relay stick closed, and can damage the soft-start resistors and wiring. Test before applying power if you suspect one.', 'If an IGBT fails, it will often conduct enough current to make a relay stick closed'),
          f(51, 'If any IGBT fails its test, the inverter needs to be replaced.', 'If any IGBT fails the test, the inverter will need to be replaced'),
          f(53, 'The battery terminals have no reverse-polarity protection. Reversed 51.2 V forward-biases the IGBT body diodes and will probably destroy something.', 'The battery terminals are not protected from reverse polarity'),
          f(53, 'Battery IGBT check, with all power disconnected and the terminals near 0 V: on diode check the reading slowly rises to about 0.8 to 1 V and holds. This takes a couple of minutes.', 'will slowly rise to about 0.8 to 1V and hold there'),
          f(54, 'The MPPT and inverter IGBT tests need every source of power disconnected from the inverter.', 'These tests must be performed with all sources of power disconnected from the inverter'),
          f(54, 'MPPT diode check: positive on BOOST1+ reads a forward diode, about 0.37 V. Negative on BOOST1+ reads OL.', 'Pos on BOOST1+ should be a forward bias diode, about 0.37V'),
        ],
      },
    ],
    questions: [
      q(45, 'Where is the Sanctuary 2 line 1 load relay on the I/O board?', 'On the left', ['On the right', 'On the control board', 'Behind the DIN rail'], 'The line 1 load relay is the one on the left'),
      q(45, 'On a Sanctuary 2 with the inverter off, there is continuity across the terminals above a load relay. What does that mean?', 'The relay contacts are welded closed', ['The relay is working normally', 'The firmware has a fault', 'The grid is present'], 'its terminals are welded together'),
      q(48, 'Sanctuary 3, inverter running, grid breaker off. What shows the grid relay is stuck closed?', '120 V to N at a grid port', ['240 V between L1 and L2 at the load port', '0 V at the load port', '120 V at the load port on L1'], 'If either of the grid ports has 120V to N, the grid relay is stuck closed'),
      q(48, 'Sanctuary 3, inverter off. What is a normal grid relay reading?', 'An open circuit, roughly 2 M ohms', ['Close to 0 ohms', 'About 0.37 V', 'About 5 V'], 'It should be open circuit, roughly 2M Ohms'),
      q(51, 'A Sanctuary 2 IGBT fails its test. What do you do?', 'Replace the inverter', ['Replace the control board only', 'Reflash the firmware', 'Replace the batteries'], 'If any IGBT fails the test, the inverter will need to be replaced'),
      q(53, 'What happens if reverse polarity is applied to the battery terminals?', 'It forward-biases the IGBT body diodes and will probably destroy something', ['A fuse blows and the inverter is protected', 'The inverter alarms and recovers by itself', 'The battery breaker trips and protects the inverter'], 'Reverse polarity on the battery terminals with a 51.2V battery will forward bias the IGBT body diodes and probably destroy something'),
      q(54, 'What is required before running the MPPT and inverter IGBT tests?', 'All sources of power disconnected from the inverter', ['The inverter running at full load', 'The battery connected and switched on', 'Only the grid breaker off'], 'These tests must be performed with all sources of power disconnected from the inverter'),
      q(54, 'On diode check, positive on BOOST1+ and negative on BUS+ in a healthy MPPT reads about:', '0.37 V', ['1.2 V', '0.05 V', 'OL'], 'Pos on BOOST1+ should be a forward bias diode, about 0.37V'),
    ],
  },
  {
    id: 'firmware-recovery',
    part: PART,
    title: 'Recovering from a failed firmware update',
    intro: 'What the two processors do, how to spot a failed update, and the order to try fixes.',
    pages: [55, 57],
    lessons: [
      {
        heading: 'The two processors',
        facts: [
          f(55, 'The DSP handles the waveforms and switching the IGBTs. The ARM handles relays, power switch, USB, RS-485 and the front panel LEDs.', 'The DSP (digital signal processor) microcontroller handles the waveforms and switching the IGBTs'),
          f(55, 'Three LEDs on the processor board: left is the DSP heartbeat, the one in the middle is the ARM heartbeat, and the one on the right edge is power.', 'The left LED is the heartbeat indicator for the DSP processor'),
          f(55, 'While the inverter is on, the DSP and ARM LEDs should flash and the power LED should be steady. A processor whose LED is not flashing is not running.', 'The power LED should be on steady'),
        ],
      },
      {
        heading: 'Signs of a failed update',
        facts: [
          f(56, 'No status LEDs on the front panel when power is on, or an endless boot loop with the relays clicking every few seconds.', 'Endless boot loop where the relays click every few seconds'),
          f(56, 'The DSP or ARM LED not flashing, the USB port not recognized, or no response to RS-485 queries (restart the communicator first).', 'try restarting the communicator first'),
          f(56, 'Two inverters on the communicator with the same modbus address during an update makes it fail so badly the firmware must be flashed directly to the board.', 'it needs the firmware flashed directly to the board'),
        ],
      },
      {
        heading: 'What to try, in order',
        facts: [
          f(56, 'Power-cycle: PV switch off, grid off, generator off, power buttons off (on Sanctuary 2 rev 1 also unplug all batteries). Wait 30 s until the relays click and the LEDs are off. Turn it back on and re-try.', 'Wait 30s until the relays click'),
          f(56, 'After a power cycle, an ARM LED that is not flashing means it is locked up. It needs a special programmer, so call ESS support.', 'it\'s locked up and you can\'t update any firmware via USB or RS-485'),
          f(56, 'If re-flashing the DSP fails, re-flash the ARM (.axf) by USB, then by RS-485. After a good ARM flash, re-flash the DSP (.out) by USB, then RS-485.', 're-flashing the ARM processor (.axf file) via USB'),
          f(57, 'If the DSP still will not flash, a special programmer is needed to flash it to the board. Call ESS support.', 'a special programmer is required to re-flash the DSP directly to the board'),
        ],
      },
    ],
    questions: [
      q(55, 'Which processor handles the waveforms and switches the IGBTs?', 'The DSP', ['The ARM', 'The EMS-C', 'The BMS'], 'The DSP (digital signal processor) microcontroller handles the waveforms and switching the IGBTs'),
      q(55, 'While the inverter is on, how should the processor board\'s power LED behave?', 'On steady', ['Flashing', 'Off', 'Alternating with the ARM LED'], 'The power LED should be on steady'),
      q(56, 'Which is a sign of a failed firmware update?', 'An endless boot loop where the relays click every few seconds', ['A solid green front panel LED', 'The battery breaker trips once', 'The Wi-Fi light blinks'], 'Endless boot loop where the relays click every few seconds'),
      q(56, 'What happens if two inverters on one communicator have the same modbus address during a firmware update?', 'The update fails so badly the firmware must be flashed directly to the board', ['The update only runs on the first inverter', 'The communicator picks one automatically', 'Nothing: the update simply takes longer'], 'it needs the firmware flashed directly to the board'),
      q(56, 'How long do you wait during the power cycle?', '30 seconds, until the relays click', ['5 seconds', '2 minutes', '10 minutes'], 'Wait 30s until the relays click'),
      q(56, 'After a power cycle, the ARM LED is still not flashing. What do you do?', 'Call ESS support: it is locked up and needs a special programmer', ['Flash the DSP over RS-485', 'Recommission the system', 'Replace the battery'], 'it\'s locked up and you can\'t update any firmware via USB or RS-485'),
      q(56, 'Which file type is the ARM firmware?', '.axf', ['.out', '.bin', '.hex'], 're-flashing the ARM processor (.axf file) via USB'),
      q(56, 'Which processor is re-flashed with the .out file?', 'The DSP', ['The ARM', 'The EMS-C', 'The BMS'], 're-flashing the DSP (.out file) via USB'),
    ],
  },
]
