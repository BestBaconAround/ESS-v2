import { f, q, type CourseModule } from './types'

const PART = 'Batteries'

export const PART_2: CourseModule[] = [
  {
    id: 'battery-basics',
    part: PART,
    title: 'Battery basics and the BMS',
    intro: 'What is inside a Sanctuary battery, what the BMS does, and why a battery sometimes shuts itself off.',
    pages: [20, 22],
    lessons: [
      {
        heading: 'What is inside',
        facts: [
          f(20, 'Sixteen 3.2 V LiFePO4 prismatic cells in series make a nominal 51.2 V battery.', 'sixteen 3.2V lithium iron phosphate (LiFePO4) prismatic cells connected in series to form a (nominal) 51.2 V battery'),
          f(20, 'A 250 A circuit breaker. The BMS can turn it off electronically, for example if current still flows after the MOSFETs are off.', 'The Sanctuary battery includes a 250 A circuit breaker'),
          f(20, 'Sanctuary 3 (white) and Sanctuary 2 (black) batteries communicate differently, so they are not compatible with each other\'s inverters.', 'Sanctuary 3 batteries are not compatible with Sanctuary 2 inverters'),
          f(21, 'The BMS monitors battery temperature, the voltage of every cell and the current of the pack, and disconnects the battery in damaging conditions.', 'The BMS will monitor battery temperature, the voltage of every cell, and the current of the pack'),
        ],
      },
      {
        heading: 'Why a battery shuts off',
        facts: [
          f(21, 'If the inverter\'s battery terminal voltage is under 20 V, its capacitors draw so much current that the battery sees a short circuit and disables discharging.', 'the battery thinks it\'s a short circuit and will disable discharging'),
          f(21, 'If the inverter is connected to grid or solar, it then settles to about 11 V. The battery needs a voltage greater than its own to re-enable discharging.', 'The battery needs a voltage greater than its own to re-enable discharging'),
          f(21, 'Battery awaken raises the battery terminals, usually to 48.5 V for a minute, if grid or solar is available. Since the October 2023 firmware it may happen automatically.', 'usually to 48.5V for a minute if grid or solar power is available'),
          f(21, 'When both charging and discharging are disabled, unplugging one power cable for 10 seconds usually re-enables a Sanctuary 2 battery. A Sanctuary 3 battery resets itself.', 'Usually disconnecting one power cable for 10 seconds will re-enable discharging on a Sanctuary 2 battery'),
          f(21, 'A Sanctuary 2 battery below 0% with any cell under 2300 mV: the BMS turns off the breaker and goes to minimum power mode. Turn the breaker on to wake it with charging current.', 'any cell voltage drops below 2300 mV'),
          f(21, 'Terminals reading 0 V DC mean the circuit breaker is likely off.', 'If the battery terminals read 0V DC, the circuit breaker is likely off'),
        ],
      },
    ],
    questions: [
      q(20, 'How is a Sanctuary battery built?', 'Sixteen 3.2 V LiFePO4 cells in series, for 51.2 V nominal', ['Twelve 3.2 V LiFePO4 cells in series, for 38.4 V nominal', 'Sixteen 3.2 V cells in parallel, for 3.2 V nominal', 'Four 12.8 V lead-acid cells in series, for 51.2 V nominal'], 'sixteen 3.2V lithium iron phosphate (LiFePO4) prismatic cells connected in series to form a (nominal) 51.2 V battery'),
      q(20, 'What size is the circuit breaker in a Sanctuary battery?', '250 A', ['100 A', '150 A', '400 A'], 'The Sanctuary battery includes a 250 A circuit breaker'),
      q(21, 'Why can a battery disable discharging when connected to an inverter whose battery terminals are under 20 V?', 'The inverter\'s capacitors draw so much current that the battery thinks it is a short circuit', ['The BMS detects reverse polarity', 'The battery\'s cells are over-charged', 'The inverter sends a shutdown signal over RS-485'], 'when the inverter\'s battery terminal voltage is less than 20V, when you connect the battery, the inverter\'s capacitors draw so much current from the battery that the battery thinks it\'s a short circuit and will disable discharging'),
      q(21, 'To what voltage does battery awaken usually raise the battery terminals?', '48.5 V', ['24 V', '36 V', '60 V'], 'usually to 48.5V for a minute if grid or solar power is available'),
      q(21, 'A Sanctuary 2 battery has disabled both charging and discharging. What usually re-enables it?', 'Disconnecting one power cable for 10 seconds', ['Re-commissioning the system', 'Waiting 24 hours with the breaker on', 'Switching the inverter to standby'], 'Usually disconnecting one power cable for 10 seconds will re-enable discharging on a Sanctuary 2 battery'),
      q(21, 'When does the Sanctuary 2 BMS turn off the circuit breaker and go to minimum power mode?', 'When the battery is discharged below 0% and any cell voltage drops below 2300 mV', ['When any cell voltage goes above 3650 mV', 'When the inverter loses the grid for five minutes', 'When the battery is below 50% for a full day'], 'if the battery is discharged to below 0% and any cell voltage drops below 2300 mV'),
      q(21, 'The battery terminals read 0 V DC. What is the likely cause?', 'The circuit breaker is off', ['The BMS firmware is old', 'The cells are fully charged', 'The communicator is offline'], 'If the battery terminals read 0V DC, the circuit breaker is likely off'),
    ],
  },
  {
    id: 'battery-comm-s2',
    part: PART,
    title: 'Battery communication: Sanctuary 2',
    intro: 'How to find out why a Sanctuary 2 battery will not communicate: the bus, the addresses, the terminals and the cables.',
    pages: [22, 24],
    lessons: [
      {
        heading: 'Start here',
        facts: [
          f(22, 'The most common BMS communication problem is improper cable routing. Sanctuary 2 and Sanctuary 3 are wired differently.', 'The most common BMS communication problem is caused by improper cable routing'),
          f(22, 'All batteries must be on the same RS-485 bus, connected to the inverter\'s BMS port.', 'be sure that all batteries are on the same RS-485 bus and connected to the inverter\'s BMS port'),
          f(22, 'After a long BMS communication failure, the inverter sometimes has to be power-cycled before communication returns.', 'sometimes the inverter must be power-cycled before BMS communication is restored'),
          f(22, 'In the Lion Technician app, use Select Service > Read Battery Address on each battery.', 'Use the Lion Technician app > Select Service > Read Battery Address'),
          f(22, 'Each battery has its own unique BMS address. They are sequential from #1, usually left to right.', 'Addresses must be sequential, starting with address #1'),
        ],
      },
      {
        heading: 'Measuring at the terminals',
        facts: [
          f(22, 'If a battery cannot communicate, check DC voltage at its terminals. 0 V means the breaker may be off and the BMS asleep.', 'If the voltage measures 0 V, the circuit breaker may be off and the BMS may be asleep'),
          f(22, 'Put the probe in the small hole in the center of the terminal. Never down the side: the outer part is connected to the case and the probes could short the battery.', 'Do not put probes down the side of the terminal'),
        ],
      },
      {
        heading: 'Testing the cables',
        facts: [
          f(23, 'If the voltage is good, test every Ethernet-style cable, splitter and coupler with an Ethernet cable tester.', 'check all Ethernet style cables using an Ethernet cable tester'),
          f(23, 'Round 4-pin connector: A = green (RS-485 A), B = orange (RS-485 B), C = no connection, D = blue (GND).', 'A = Green (RS-485 A) B = Orange (RS-485 B) C = No connection D = Blue (GND)'),
          f(24, 'RJ45: pin 6 = blue (GND), pin 7 = green (RS-485 A), pin 8 = orange (RS-485 B).', '6 = Blue (GND) 7 = Green (RS-485 A) 8 = Orange (RS-485 B)'),
          f(24, 'Sanctuary 1 batteries have RJ45 ends wired on pins 1, 2 and 3, the mirror opposite of Sanctuary 2.', 'were wired using pins 1, 2, and 3'),
        ],
      },
    ],
    questions: [
      q(22, 'What is the most common cause of a BMS communication problem?', 'Improper cable routing', ['A failed BMS board in the first battery', 'Old firmware on the child inverter', 'A tripped grid breaker upstream of the inverter'], 'The most common BMS communication problem is caused by improper cable routing'),
      q(22, 'Where do you check whether a Sanctuary 2 battery can communicate?', 'Lion Technician app > Select Service > Read Battery Address', ['Lion Smart app > Settings > Battery addresses', 'The power switch on the EMS-C, read from the front', 'smart.lionenergy.com > Billing > Components'], 'Use the Lion Technician app > Select Service > Read Battery Address'),
      q(22, 'What is the rule for battery BMS addresses?', 'Each battery has its own unique address, sequential starting at #1', ['All batteries share address #1, so the inverter treats them as one', 'Addresses start at #0 and may skip numbers if a battery is removed', 'Only the first battery needs an address, and the others follow it'], 'Each battery must have its own unique BMS address'),
      q(22, 'Where do you put the probe to measure battery terminal voltage?', 'In the small hole in the center of the terminal', ['Down the side of the terminal', 'On the outer ring of the terminal', 'On the case, next to the terminal'], 'The battery terminals have a small hole in the center of the terminal. This is for measuring voltage'),
      q(22, 'A battery will not communicate and its terminals read 0 V. What may be true?', 'The circuit breaker may be off and the BMS may be asleep', ['The cells are fully charged', 'The communicator antenna is wrong', 'The CTs are reversed'], 'If the voltage measures 0 V, the circuit breaker may be off and the BMS may be asleep'),
      q(23, 'On the round 4-pin BMS connector, what is C?', 'No connection', ['GND', 'RS-485 A', 'RS-485 B'], 'C = No connection'),
      q(24, 'On the RJ45 BMS connector, which pin is GND?', 'Pin 6 (blue)', ['Pin 1', 'Pin 7 (green)', 'Pin 8 (orange)'], '6 = Blue (GND) 7 = Green (RS-485 A) 8 = Orange (RS-485 B)'),
    ],
  },
  {
    id: 'battery-wont-connect',
    part: PART,
    title: 'Low and disabled batteries',
    intro: 'Waking a low battery with its breaker off, what makes the BMS disable charging, and how to test the BMS MOSFETs.',
    pages: [24, 27],
    lessons: [
      {
        heading: 'One battery is low and its breaker is off (Sanctuary 2)',
        facts: [
          f(24, 'Find the breaker inside the battery. The window shows red for on and green for off. Turn it on.', 'Red=on; green=off'),
          f(24, 'Lower the charge current to 20 A: "Inverter Max Charge Current" for a single inverter, "System Charge Current" for parallel. Put the system in battery priority (Emergency) mode.', 'set "Inverter Max Charge Current" to 20A'),
          f(24, 'Unplug a power cable from each of the other batteries, then plug in the low battery so it charges alone and the BMS wakes up.', 'Unplug one power cable from each of the other batteries so the low battery can charge up by itself'),
          f(24, 'If it will not charge, send "activate battery", or use a 60 V / 5 A supply at 54 V / 5 A on the inverter\'s battery terminals.', 'Set the power supply to 54V/5A'),
          f(25, 'Once the lowest cell is over 3.0 V, restore the charge current (usually 140 A). Plug in each next battery when the inverter is within 0.5 V of it.', 'After the low battery\'s minimum cell voltage is over 3.0V, increase the charging current'),
          f(25, 'Front cover screws go back to about 29 inch-pounds. Then return the system from emergency mode to normal mode.', 'These screws should be tightened to about 29 inch-pounds'),
        ],
      },
      {
        heading: 'Why the BMS disables charging or discharging',
        facts: [
          f(25, 'Batteries should be within 0.5 V of each other before they are connected in parallel.', 'The batteries should be within 0.5V of each other before connecting batteries in parallel'),
          f(25, 'Max MOSFET temperature over 79 °C (default): the inverter stops battery charging and discharging.', 'The inverter stops battery charging/discharging when the max MOSFET temperature > 79'),
          f(26, 'Max cell voltage over 3650 mV: the battery stops charging.', 'The battery stops charging when the max cell voltage > 3650 mV'),
          f(26, 'Min cell voltage under 2400 mV: the battery stops discharging. The inverter stops discharge under 2650 mV.', 'The battery stops discharging when the min cell voltage < 2400 mV'),
          f(26, 'A spread of over 700 mV between the highest and lowest cell may disable both. Some batteries use 1000 mV instead.', 'Max to min cell voltage > 700 mV may cause the battery to disable both charging and discharging'),
          f(26, 'Cell temperature: the inverter will not use the battery above 50 °C, and the battery should not charge below 0 °C.', 'The battery should not charge below 0'),
          f(26, 'Charging a single low cell from a DC supply: open circuit voltage of no more than 3.65 V. Overcharging one cell reduces the pack\'s amp-hours.', 'Set the power supply\'s open circuit voltage to no more than 3.65V'),
        ],
      },
      {
        heading: 'Testing the BMS MOSFETs',
        facts: [
          f(27, 'Do this if the breaker trips repeatedly or the MOSFETs overheat. Turn off the battery breaker and unplug the cell temperature sensor plug (it then reads -50 °C, disabling charge and discharge).', 'If the battery breaker trips repeatedly or if the MOSFETs overheat, test if there\'s a short in the charge/discharge MOSFETs'),
          f(27, 'Meter on diode check across the BMS power terminals. A good MOSFET reads OL both ways.', 'The meter should read "OL"'),
          f(27, 'A forward diode voltage drop in either direction means a MOSFET is damaged and the BMS needs replacing.', 'a MOSFET is damaged and the BMS needs to be replaced'),
        ],
      },
    ],
    questions: [
      q(24, 'On the battery breaker\'s window, which colour means ON?', 'Red', ['Green', 'Yellow', 'White'], 'Red=on; green=off'),
      q(24, 'Which setting do you set to 20 A on a single-inverter system when waking a low battery?', 'Inverter Max Charge Current', ['System Charge Current', 'Generator charge current', 'Grid charge current'], 'set "Inverter Max Charge Current" to 20A'),
      q(24, 'What do you set the variable power supply to when starting to charge a low battery from the inverter\'s battery terminals?', '54 V / 5 A', ['12 V / 20 A', '24 V / 10 A', '120 V / 5 A'], 'Set the power supply to 54V/5A'),
      q(25, 'How close in voltage should batteries be before you connect them in parallel?', 'Within 0.5 V', ['Within 5 V', 'Within 2 V', 'Within 0.05 V'], 'The batteries should be within 0.5V of each other before connecting batteries in parallel'),
      q(26, 'At what max cell voltage does the battery stop charging?', 'Above 3650 mV', ['Above 3200 mV', 'Above 3300 mV', 'Above 4200 mV'], 'The battery stops charging when the max cell voltage > 3650 mV'),
      q(26, 'At what min cell voltage does the battery stop discharging?', 'Below 2400 mV', ['Below 3000 mV', 'Below 2800 mV', 'Below 1800 mV'], 'The battery stops discharging when the min cell voltage < 2400 mV'),
      q(25, 'The default max MOSFET temperature at which the inverter stops battery charging and discharging is:', 'Above 79 °C', ['Above 40 °C', 'Above 60 °C', 'Above 95 °C'], 'The inverter stops battery charging/discharging when the max MOSFET temperature > 79'),
      q(27, 'Testing the BMS MOSFETs with the meter on diode check, what does a healthy BMS read?', 'OL in both directions', ['A forward diode voltage drop in both directions', '0 V in both directions', 'About 0.37 V in one direction only'], 'The meter should read "OL"'),
    ],
  },
  {
    id: 'battery-comm-s3',
    part: PART,
    title: 'Battery communication: Sanctuary 3',
    intro: 'The power button, the cable layout, firmware versions and the PACEEX app.',
    pages: [27, 31],
    lessons: [
      {
        heading: 'Power and wake-up',
        facts: [
          f(27, 'The round battery power button: if it is off, the battery cannot charge or discharge, and communication is disabled.', 'If this button is off, the battery cannot accept charging current and cannot discharge power'),
          f(28, 'Button on but no LEDs: the battery is likely below 0% with the BMS asleep. It needs charging current to wake up.', 'the battery is likely below 0%, with the BMS in sleep mode'),
        ],
      },
      {
        heading: 'If the inverter has a BMS com alarm',
        facts: [
          f(28, 'Cables: parent inverter Parallel A to the EMS-C inverter port. EMS-C battery port to COM1 on battery #1. COM2 to the next battery\'s COM1. The last COM2 stays empty.', 'The EMS-C\'s battery port connects to the COM1 port on battery #1'),
          f(28, 'Power-cycle all the batteries (button off, then on), then the inverter.', 'Push the round power button off, then on, for all batteries'),
          f(28, 'Firmware: ARM at least 0.5.6 and DSP at least 1.9. Anything older than the original June 2025 release will not communicate with the batteries.', 'ARM version must be at least 0.5.6'),
          f(28, 'Long cable and CAN reflections: enable micro-switch #1 on the last inverter only. It connects a 120 Ohm termination resistor. The EMS-C already has one.', 'enabling micro-switch #1 on the last inverter only'),
          f(28, 'Test every cable with an Ethernet tester. No RJ45 splitters are used on Sanctuary 3 BMS cables.', 'No RJ45 splitters are used on Sanctuary 3 BMS com cables'),
          f(28, 'Check it was commissioned with the correct number of batteries.', 'Make sure the Sanctuary system was commissioned with the correct number of batteries'),
        ],
      },
      {
        heading: 'The PACEEX app',
        facts: [
          f(29, 'Turn off all batteries but #1 and connect to it. Software 41826-1.02 is the old version and should be upgraded to 41826-1.40 with an iPhone.', 'please use an iPhone with the PACEEX BMS app to upgrade to 41826-1.40'),
          f(29, 'With all batteries on, "PACK parallel number" should equal the number of batteries.', '"PACK parallel number" should be the number of batteries'),
          f(31, 'All batteries should be on the same firmware version.', 'Make sure all batteries are on the same firmware'),
        ],
      },
    ],
    questions: [
      q(27, 'The Sanctuary 3 battery power button is off. What happens?', 'The battery cannot charge or discharge, and communication is disabled', ['The battery charges but cannot discharge', 'Only communication is disabled', 'Nothing: the button only controls the LEDs'], 'If this button is off, the battery cannot accept charging current and cannot discharge power'),
      q(28, 'The battery button is on but no LEDs light. What is likely?', 'The battery is below 0% with the BMS in sleep mode', ['The battery breaker is welded closed', 'The cell heater has failed', 'The EMS-C is offline'], 'the battery is likely below 0%, with the BMS in sleep mode'),
      q(28, 'Which EMS-C port connects to COM1 on battery #1?', 'The battery port', ['The inverter port', 'The ethernet port', 'The USB port'], 'The EMS-C\'s battery port connects to the COM1 port on battery #1'),
      q(28, 'What is the minimum DSP firmware version for Sanctuary 3 battery communication?', '1.9', ['0.5.6', '1.2', '2.0'], 'DSP version must be at least 1.9'),
      q(28, 'Where do you enable micro-switch #1 to add a 120 Ohm termination resistor?', 'On the last inverter only', ['On every inverter', 'On the parent inverter only', 'On the EMS-C'], 'enabling micro-switch #1 on the last inverter only'),
      q(28, 'Which is true of RJ45 splitters on Sanctuary 3 BMS com cables?', 'None are used', ['One is used at each battery', 'One is used at the EMS-C only', 'They are optional'], 'No RJ45 splitters are used on Sanctuary 3 BMS com cables'),
      q(29, 'In the PACEEX app, what should "PACK parallel number" show?', 'The number of batteries', ['The number of inverters', 'The battery state of charge', 'The firmware version'], '"PACK parallel number" should be the number of batteries'),
    ],
  },
]
