import { f, q, type CourseModule } from './types'

const PART = 'Foundations'

export const PART_1: CourseModule[] = [
  {
    id: 'safety',
    part: PART,
    title: 'Safety',
    intro: 'The rules to follow before you touch a Sanctuary, and what to do when something is wrong.',
    pages: [6, 8],
    lessons: [
      {
        heading: 'Before you touch it',
        facts: [
          f(6, 'Disconnect all power sources, AC and DC terminals included, before any maintenance or cleaning. Use lockout/tagout.', 'Always disconnect all power sources, including the AC and DC terminals, before performing any maintenance or cleaning'),
          f(7, 'Only qualified personnel or technicians install, service or maintain the system.', 'must be performed by qualified personnel/technicians'),
          f(7, 'Do not power on until a final continuity check confirms every connection is secure and correct.', 'Do not power on the system until a final continuity check is performed'),
          f(7, 'Never use a battery with a damaged cell or leaking electrolyte.', 'Do not use a battery with a damaged cell or leaking electrolyte'),
          f(7, 'Be careful with metal tools near batteries. A dropped tool on an energized conductor can cause a short circuit, fire or explosion.', 'Dropping tools on energized conductors can cause short circuits, leading to potential fires or explosions'),
        ],
      },
      {
        heading: 'Outdoors and emergencies',
        facts: [
          f(7, 'Outdoors, keep IP65 and NEMA 3R protection. Seal any hole made in the wire box with the right fittings.', 'maintain IP65 and NEMA 3R protection'),
          f(7, 'In a fire, evacuate and call emergency services. Overheated batteries may release hydrogen gas.', 'Overheated batteries may release hydrogen gas'),
          f(7, 'If smoke comes out of the unit, treat it as an emergency. Do not operate it, get clear of it, and contact emergency services as well as a qualified technician or ESS Support.', 'If smoke comes out, do not operate'),
          f(7, 'If the unit or any part is damaged, or any wiring overheats, do not operate the system. Contact a qualified technician or ESS Support for inspection and repair.', 'Do not operate if any wiring overheats'),
        ],
      },
      {
        heading: 'How to read the manual',
        facts: [
          f(6, 'WARNING: could result in injury or death. CAUTION: could cause minor injury or equipment damage. NOTE: an important tip, not about safety or damage.', 'Indicates an important step or tip that leads to best results but is not safety or damage related'),
          f(8, 'Most problems the ESS support team sees are caused by incorrect installation.', 'The majority of problems that our ESS support team deals with are due to incorrect installation'),
        ],
      },
    ],
    questions: [
      q(6, 'What does a WARNING in the manual indicate?', 'A hazardous situation that could result in injury or death', ['A hazardous situation that could cause minor injury or equipment damage', 'An important tip that is not about safety', 'A step that only an installer may perform'], 'WARNING: Indicates a hazardous situation which, if not avoided, could result in injury or death'),
      q(6, 'Before maintenance or cleaning, what must you do?', 'Disconnect all power sources, AC and DC terminals included, and use lockout/tagout', ['Turn off only the AC breaker', 'Put the system in emergency mode', 'Switch the inverter to standby with the power button'], 'Always disconnect all power sources, including the AC and DC terminals, before performing any maintenance or cleaning'),
      q(7, 'Which enclosure protection must be kept when the system is installed outdoors?', 'IP65 and NEMA 3R', ['IP44 and NEMA 1', 'IP54 and NEMA 4', 'IP67 and NEMA 6P'], 'maintain IP65 and NEMA 3R protection'),
      q(8, 'What does the introduction say causes the majority of problems the ESS support team deals with?', 'Incorrect installation', ['Battery failures', 'Firmware bugs', 'Homeowners changing settings'], 'The majority of problems that our ESS support team deals with are due to incorrect installation'),
      q(7, 'Smoke comes out of the unit. What should you do?', 'Treat it as an emergency: do not operate it, get clear, and contact emergency services, then a qualified technician or ESS Support', ['Keep it running until the battery is empty, then call ESS Support in the morning', 'Power-cycle it and watch whether the alarm clears before calling anyone', 'Switch it to emergency mode and let the batteries discharge into the loads'], 'If smoke comes out, do not operate', 'The manual says not to operate the unit if smoke comes out, and in case of fire to evacuate the area and contact emergency services immediately. Smoke is an emergency: call emergency services, then a qualified technician or ESS Support.'),
      q(7, 'What must be done before powering on a newly installed system?', 'A final continuity check', ['A firmware update', 'A recommission', 'A full battery charge'], 'Do not power on the system until a final continuity check is performed'),
    ],
  },
  {
    id: 'know-the-system',
    part: PART,
    title: 'Know the system',
    intro: 'How to tell the versions apart, which batteries and inverters work together, and how the inverter behaves on and off the grid.',
    pages: [14, 18],
    lessons: [
      {
        heading: 'Telling the Sanctuary 2 revisions apart',
        facts: [
          f(14, 'Rev 1 has six black plastic RJ45 connectors on the I/O board.', 'Sanctuary 2 rev1 (below) had six black plastic RJ45 connectors on the I/O board'),
          f(14, 'Rev 2 changed to six metallic RJ45 connectors facing down, and kept one row of green push connectors.', 'Sanctuary 2 rev2 changed to six metallic RJ45 connectors, facing downward'),
          f(14, 'Rev 3 added a black plastic RJ45 connector to the left of the six metallic ones, and a second row of push connectors.', 'Rev3 added a black plastic RJ45 connector to the left of the six metallic RJ45 connectors and added a second row of push connectors'),
          f(15, 'Rev 4 changed from push connectors to plug-in screw terminals, and has two power buttons on the side.', 'changed from push connectors to plug-in screw terminals'),
          f(15, 'Sanctuary 3 also has two power buttons on the side, and its case is white.', 'The Sanctuary 3 also has two power buttons on the side and the case is white'),
        ],
      },
      {
        heading: 'What works with what',
        facts: [
          f(16, 'Sanctuary 3 batteries talk to the inverter over CAN. They are not compatible with Sanctuary 2 batteries.', 'Sanctuary 3 batteries communicate with the inverter over CAN and are not compatible with Sanctuary 2 batteries'),
          f(16, 'Sanctuary 1 and Sanctuary 2 batteries use the same modbus protocol over RS-485.', 'use the same modbus communication protocol over RS-485'),
          f(17, 'In the compatibility chart, YES* means compatible with a BMS com cable change.', 'YES* means compatible with a BMS com cable change'),
        ],
      },
      {
        heading: 'How the inverter works',
        facts: [
          f(17, 'The main parts are a controller, a bidirectional inverter, a bidirectional DC-DC converter, MPPT converters and relays.', 'controller, bidirectional inverter, bidirectional DC-DC converter, MPPT converters, and relays'),
          f(17, 'Off-grid it is grid forming: the inverter sets the voltage and frequency, and the loads decide the AC output power.', 'the inverter operates in grid forming mode where the inverter sets the output voltage and frequency waveform'),
          f(17, 'On the grid it is grid following: the grid sets voltage and frequency. It also runs grid following on a generator.', 'The inverter also runs in grid following mode when connected to a generator'),
          f(18, 'Sanctuary 3 has no load relays. It has built-in circuit breakers for the generator, grid and load ports.', 'Sanctuary 3 includes built-in circuit breakers for the generator, grid, and load ports'),
        ],
      },
    ],
    questions: [
      q(14, 'Which Sanctuary 2 revision first added a second row of push connectors?', 'Rev 3', ['Rev 1', 'Rev 2', 'Rev 4'], 'added a second row of push connectors'),
      q(15, 'Which Sanctuary 2 revision changed from push connectors to plug-in screw terminals?', 'Rev 4', ['Rev 1', 'Rev 2', 'Rev 3'], 'changed from push connectors to plug-in screw terminals'),
      q(16, 'How do Sanctuary 3 batteries communicate with the inverter?', 'Over CAN', ['Over RS-485 modbus', 'Over Wi-Fi', 'Over Bluetooth'], 'Sanctuary 3 batteries communicate with the inverter over CAN'),
      q(17, 'What does "YES*" mean in the compatibility chart?', 'Compatible with a BMS com cable change', ['Compatible only on grid-tied systems', 'Compatible only with firmware from October 2023 on', 'Compatible only with a different communicator'], 'YES* means compatible with a BMS com cable change'),
      q(17, 'Connected to the grid, which mode is the inverter in?', 'Grid following: the grid sets the voltage and frequency', ['Grid forming: the inverter sets the voltage and frequency', 'Standby: the inverter waits for the loads', 'Bypass: the loads run straight from the grid'], 'When connected to the grid, the inverter operates in grid following mode where the grid sets the voltage and frequency waveform'),
      q(17, 'Off-grid, what sets the output voltage and frequency?', 'The inverter, in grid forming mode', ['The loads', 'The battery BMS', 'The solar panels'], 'the inverter operates in grid forming mode where the inverter sets the output voltage and frequency waveform'),
      q(18, 'Which version has no load relays?', 'Sanctuary 3', ['Sanctuary 2 rev 1', 'Sanctuary 2 rev 3', 'Sanctuary 2 rev 4'], 'Sanctuary 3 is not equipped with the load relays'),
    ],
  },
  {
    id: 'installation-power-up',
    part: PART,
    title: 'Installation and power-up',
    intro: 'Parallel systems, the CTs, and the exact order for powering on and shutting down.',
    pages: [8, 10],
    lessons: [
      {
        heading: 'Parallel systems',
        facts: [
          f(8, 'If the loads of two or more inverters are connected in parallel, commission it as a parallel system. If the load ports do not connect together, commission the inverters separately.', 'the system must be commissioned as a parallel system'),
          f(8, 'Parallel inverters must all connect to the same parallel battery bank. The banks cannot be separated.', 'The parallel inverters must all connect to the same parallel battery bank'),
        ],
      },
      {
        heading: 'The CTs',
        facts: [
          f(9, 'The CTs are separate so the inverter can supply non-backed-up loads and keep the utility bill down.', 'The reason the CTs are separate from the inverter is so that the inverter can supply power to non-backed-up loads, minimizing the utility bill'),
          f(9, 'CTs on the wrong lines, or facing the wrong way, make current read backwards.', 'If the CTs are placed on the opposite lines, the current will read backwards'),
          f(9, 'On the RJ45 CT connector, pins 3 and 6 are the CT. Pin 3 is N and pin 6 is P.', 'pins 3 & 6 are used for the CT'),
          f(9, 'Rev 4 and Sanctuary 3 combine both CTs in one plug: L1 on pins 3 and 6, L2 on pins 1 and 2.', 'Pins 3 & 6 are used for the L1 CT'),
          f(9, 'If that plug goes in the meter port, only the L2 CT reads power, backwards, and L1 shows none.', 'only the L2 CT will read power'),
        ],
      },
      {
        heading: 'Powering on, in order',
        facts: [
          f(10, 'Batteries first. Sanctuary 2: plug in each battery within 20 seconds of the previous one. Sanctuary 3: turn on each battery power button.', 'plug in the power cables on each battery within 20 seconds of the previous battery'),
          f(10, 'Then the Complete System Shutdown switch (button recessed), and the PV switch (clockwise to horizontal).', 'Turn on the PV switch by rotating it clockwise to the horizontal (on) position'),
          f(10, 'Then the grid-port circuit breaker, the EMS-C power switch (up), and the AC/DC On/Off switch (button recessed).', 'Turn on the power switch on the EMS-C by sliding it to the up (on) position'),
          f(10, 'In normal operation the load port turns on from battery power before the Sanctuary connects to the grid.', 'the Sanctuary\'s load port turns on from battery power before the Sanctuary connects to the grid'),
        ],
      },
      {
        heading: 'Shutting down',
        facts: [
          f(10, 'With a manual transfer switch, move it to the grid position first so the backup panel runs from the grid.', 'move the switch to the grid position so that the backup-loads panel is powered by the grid instead of the inverter'),
          f(10, 'Per inverter: PV switch off (counter-clockwise to vertical), AC/DC off (out, flush), EMS-C down, Complete System Shutdown off, grid-port breaker off.', 'Turn off the PV switch by rotating it counter-clockwise to the vertical (off) position'),
          f(10, 'If it will be off for more than a month, charge each battery to at least 50% first.', 'make sure each battery is charged to at least 50% before shutting down the system'),
        ],
      },
    ],
    questions: [
      q(10, 'Powering on a Sanctuary 2: how soon must each battery\'s power cables be plugged in after the previous battery?', 'Within 20 seconds', ['Within 5 seconds', 'Within 60 seconds', 'Within 5 minutes'], 'within 20 seconds of the previous battery'),
      q(10, 'Which way do you turn the PV switch to switch it on?', 'Clockwise, to the horizontal position', ['Counter-clockwise, to the horizontal position', 'Clockwise, to the vertical position', 'Counter-clockwise, to the vertical position'], 'Turn on the PV switch by rotating it clockwise to the horizontal (on) position'),
      q(10, 'The Sanctuary will be off for more than a month. What should you do before shutting down?', 'Charge each battery to at least 50%', ['Discharge each battery to 10%', 'Disconnect the CTs', 'Unplug the communicator'], 'make sure each battery is charged to at least 50% before shutting down the system'),
      q(9, 'Why are the CTs separate from the inverter?', 'So the inverter can supply non-backed-up loads and minimize the utility bill', ['So they can be replaced without a technician', 'So the inverter can measure battery current', 'So they can be shared with the solar inverter'], 'The reason the CTs are separate from the inverter is so that the inverter can supply power to non-backed-up loads, minimizing the utility bill'),
      q(9, 'On Rev 4 and Sanctuary 3, which RJ45 pins carry the L1 CT?', 'Pins 3 and 6', ['Pins 1 and 2', 'Pins 4 and 5', 'Pins 7 and 8'], 'Pins 3 & 6 are used for the L1 CT'),
      q(9, 'A Rev 4 CT plug is put in the meter port instead of the CT port. What happens?', 'Only the L2 CT reads power, and it reads backwards. L1 shows nothing', ['Both CTs read normally', 'Neither CT reads anything', 'Only L1 reads, and it reads forward'], 'only the L2 CT will read power, but will be connected to the L1 CT and read backwards'),
      q(8, 'Two inverters have their load ports connected in parallel. How must they be commissioned?', 'As a parallel system', ['As two separate systems', 'As a single inverter, then paralleled in the app', 'Either way, it makes no difference'], 'the system must be commissioned as a parallel system'),
      q(10, 'In normal operation, what comes first?', 'The load port turns on from battery power, then the Sanctuary connects to the grid', ['The Sanctuary connects to the grid, then the load port turns on', 'Both turn on at the same moment', 'The load port waits for solar power'], 'the Sanctuary\'s load port turns on from battery power before the Sanctuary connects to the grid'),
    ],
  },
  {
    id: 'commissioning',
    part: PART,
    title: 'Commissioning',
    intro: 'What first-time setup does, why you should not recommission to troubleshoot, and the post-commissioning checklist.',
    pages: [11, 14],
    lessons: [
      {
        heading: 'What commissioning is',
        facts: [
          f(11, 'The installer commissions the system once, with the Lion Technician app.', 'the installer will commission the system using the Lion Technician app'),
          f(11, 'Re-commission only when the number of batteries or inverters changes.', 'will not need to be re-commissioned unless it is necessary to change the number of batteries or inverters'),
          f(11, 'Recommissioning creates a separate new product and resets most settings to default, erasing custom configurations.', 'it creates a separate, new product in the system and resets most of the settings back to default'),
          f(11, 'Do not use recommissioning as a troubleshooting process. Unless the number of inverters or batteries was wrong, it is very unlikely to fix the problem.', 'Please do not use recommissioning as a troubleshooting process'),
        ],
      },
      {
        heading: 'Post-commissioning checklist',
        facts: [
          f(13, 'Alarms: a solid green LED is good. A flashing green LED means an active alarm or standby (button off).', 'there is an active alarm or the inverter is in standby mode'),
          f(13, 'The communicator is on the homeowner\'s Wi-Fi, not your mobile hotspot, and data shows on smart.lionenergy.com.', 'not configured to connect to your mobile hotspot'),
          f(13, 'Grid power and load power are on for every inverter. Check with the compare tool, with at least 1000 W of load per inverter.', 'at least 1000W per number of inverters'),
          f(13, 'The customer must have no way to connect grid power to the load ports. A bypass done by flipping breakers in separate panels is prohibited by Lion Energy.', 'is disallowed everywhere and is prohibited by Lion Energy'),
          f(13, 'Every installed solar string can make over 120 V in daylight, and none exceeds 500 V open circuit at the coldest temperature.', 'make sure all installed strings can produce over 120V in daylight'),
          f(14, 'Parallel system with CTs at each inverter: disable "Common Grid CT". Also set up time of use if wanted, and share access with the customer\'s email.', 'disable "Common Grid CT"'),
        ],
      },
    ],
    questions: [
      q(11, 'When does a Sanctuary need to be re-commissioned?', 'When the number of batteries or inverters changes', ['When the Wi-Fi password changes', 'When the firmware is updated', 'When an alarm will not clear'], 'will not need to be re-commissioned unless it is necessary to change the number of batteries or inverters'),
      q(11, 'What does recommissioning do?', 'Creates a separate new product and resets most settings to default', ['Keeps every custom setting and only updates firmware', 'Restores the previous product with its history', 'Only re-addresses the batteries'], 'it creates a separate, new product in the system and resets most of the settings back to default'),
      q(11, 'Is recommissioning a good way to troubleshoot?', 'No. Unless the inverter or battery count was wrong, it is very unlikely to fix the problem', ['Yes, it is the first thing to try for communication faults', 'Yes, but only on Sanctuary 3', 'Only for alarms that will not clear'], 'Please do not use recommissioning as a troubleshooting process'),
      q(13, 'The green LED on the inverter front panel is flashing. What does that mean?', 'An active alarm, or the inverter is in standby (button off)', ['The inverter is fully healthy', 'The firmware is updating', 'A fault has shut the inverter down'], 'there is an active alarm or the inverter is in standby mode'),
      q(13, 'What is the minimum voltage every installed solar string should produce in daylight?', 'Over 120 V', ['Over 48 V', 'Over 250 V', 'Over 500 V'], 'make sure all installed strings can produce over 120V in daylight'),
      q(13, 'Which Wi-Fi should the communicator be connected to?', 'The homeowner\'s Wi-Fi, not your mobile hotspot', ['Your mobile hotspot, so you can see data on site', 'Any open network nearby', 'None: it should use cellular only'], 'not configured to connect to your mobile hotspot'),
      q(13, 'How much load should you turn on to check that load power works?', 'At least 1000 W per inverter, if possible', ['At least 100 W in total', 'Exactly 5 kW', 'No load: an idle system is enough'], 'at least 1000W per number of inverters'),
      q(14, 'A parallel system has a CT at each inverter. What should you do with "Common Grid CT"?', 'Disable it', ['Enable it', 'Set it to L1 only', 'Leave it as the default'], 'disable "Common Grid CT"'),
    ],
  },
  {
    id: 'tools-and-leds',
    part: PART,
    title: 'Tools and the front panel LEDs',
    intro: 'What to bring to a service call, and what the two LEDs on the inverter tell you.',
    pages: [18, 19],
    lessons: [
      {
        heading: 'The LEDs',
        facts: [
          f(19, 'Solid green LED: no alarms.', 'A solid green LED means that there are no alarms'),
          f(19, 'Flashing green LED: one or more active alarms, and system functionality is limited.', 'A flashing green LED means there is one or more active alarms and that system functionality is limited'),
          f(19, 'Red alarm LED: a fault is present and the inverter has shut down to protect itself.', 'A red alarm LED means that a fault is present and the inverter has shut down to protect itself'),
          f(19, 'If the normal LED is on solid, the load port should be powered on.', 'the load port should be powered on'),
        ],
      },
      {
        heading: 'What to bring',
        facts: [
          f(18, 'A multi-meter with AC and DC clamp-on current measurement.', 'Multi-meter including both AC and DC clamp-on current measurement capability'),
          f(18, 'Allen wrenches: 4 mm, 6 mm and 8 mm.', 'Allen wrenches: 4mm, 6mm, 8mm'),
          f(18, 'A USB-A to USB-C cable for firmware updates.', 'USB-A to USB-C cable for firmware updating'),
          f(19, 'A 60 V / 5 A variable power supply for when batteries are at 0%.', '60V / 5A variable power supply for when batteries are at 0%'),
          f(19, 'A USB to RS-485 adapter. On its RJ-45: pin 6 is GND, pin 7 is A, pin 8 is B.', 'USB to RS-485 adapter: RJ-45 connections: 6=GND; 7=A; 8=B'),
        ],
      },
    ],
    questions: [
      q(19, 'The green LED is flashing. What does that mean?', 'One or more active alarms, and system functionality is limited', ['No alarms', 'The inverter has shut down to protect itself', 'The firmware is updating'], 'A flashing green LED means there is one or more active alarms and that system functionality is limited'),
      q(19, 'What does a red alarm LED mean?', 'A fault is present and the inverter has shut down to protect itself', ['A battery is low', 'The grid is out of range but the inverter is running', 'The communicator is offline'], 'A red alarm LED means that a fault is present and the inverter has shut down to protect itself'),
      q(19, 'Which tool is recommended for batteries that are at 0%?', 'A 60 V / 5 A variable power supply', ['A 12 V car battery charger', 'A 240 V generator', 'A clamp-on DC ammeter'], '60V / 5A variable power supply for when batteries are at 0%'),
      q(18, 'Which Allen wrench sizes are on the recommended list?', '4 mm, 6 mm and 8 mm', ['2 mm, 3 mm and 5 mm', '5 mm, 7 mm and 10 mm', '1/8", 1/4" and 3/8"'], 'Allen wrenches: 4mm, 6mm, 8mm'),
      q(19, 'On the USB to RS-485 adapter\'s RJ-45 connections, which pin is GND?', 'Pin 6', ['Pin 1', 'Pin 7', 'Pin 8'], 'USB to RS-485 adapter: RJ-45 connections: 6=GND; 7=A; 8=B'),
      q(19, 'The normal LED is on solid and not flashing. What should be true of the load port?', 'It should be powered on', ['It should be off until a technician enables it', 'It should be powered only from the grid', 'It should be in bypass'], 'the load port should be powered on'),
    ],
  },
]
