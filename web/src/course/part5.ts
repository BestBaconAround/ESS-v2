import { f, q, type CourseModule } from './types'

const PART = 'Alarms and terms'

export const PART_5: CourseModule[] = [
  {
    id: 'alarms-and-faults',
    part: PART,
    title: 'Alarms and faults',
    intro: 'The difference between an alarm and a fault, and what to do when one will not clear. The code tables are practised in Learn alarms.',
    pages: [67, 67],
    practice: { to: 'alarms', label: 'Practise the alarm codes: Learn alarms' },
    lessons: [
      {
        heading: 'Alarm or fault?',
        facts: [
          f(67, 'In general, an alarm means the system has limited capability.', 'In general, an alarm means that the system has limited capability'),
          f(67, 'In general, a fault means the system has shut down to protect itself.', 'In general, a fault means that the system has shut down to protect itself'),
          f(67, 'If an alarm or fault does not clear after the cause is fixed, power-cycle the inverter(s).', 'If an alarm or fault does not clear after the cause has been fixed, power-cycle the inverter(s)'),
          f(67, 'For persistent alarms, contact the Lion Energy ESS Support team.', 'For help troubleshooting persistent alarms, contact the Lion Energy ESS Support team'),
        ],
      },
    ],
    questions: [
      q(67, 'In general, what does an alarm mean?', 'The system has limited capability', ['The system has shut down to protect itself', 'The system must be recommissioned', 'The battery must be replaced'], 'In general, an alarm means that the system has limited capability'),
      q(67, 'In general, what does a fault mean?', 'The system has shut down to protect itself', ['The system has limited capability', 'The system is only in standby', 'The firmware is out of date'], 'In general, a fault means that the system has shut down to protect itself'),
      q(67, 'An alarm does not clear even after the cause is fixed. What should you do?', 'Power-cycle the inverter(s)', ['Recommission the system', 'Replace the BMS', 'Reset the communicator only'], 'If an alarm or fault does not clear after the cause has been fixed, power-cycle the inverter(s)'),
      q(67, 'Who do you contact for help with persistent alarms?', 'The Lion Energy ESS Support team', ['The local utility company', 'The solar panel manufacturer', 'The permitting authority'], 'For help troubleshooting persistent alarms, contact the Lion Energy ESS Support team'),
    ],
  },
  {
    id: 'solar-terms',
    part: PART,
    title: 'Terms used in solar',
    intro: 'The words that come up on calls and in the manual.',
    pages: [97, 99],
    lessons: [
      {
        heading: 'People and paperwork',
        facts: [
          f(97, 'AHJ: Authority Having Jurisdiction. The installer works with them through permitting.', 'AHJ (Authority Having Jurisdiction)'),
          f(98, 'NEC: National Electric Code. Each jurisdiction decides which version to adopt and when.', 'Each jurisdiction decides which version of the NEC to adopt and when'),
          f(99, 'PTO: Permission To Operate, which may be given after the AHJ inspects the installation.', 'Permission to operate may be given after the AHJ inspects the installation'),
          f(99, 'PCC: Point of Common Coupling, where the customer\'s system connects to the grid. It is basically at the utility billing meter.', 'It\'s basically at the utility billing meter'),
        ],
      },
      {
        heading: 'The system',
        facts: [
          f(97, 'BMS: Battery Management System. It monitors cell voltages, current and temperature, and may disable charging or discharging.', 'may respond by disabling charging or disabling discharging'),
          f(97, 'C rate: for a 280 Ah battery, 1 C is 280 A and 0.1 C is 28 A.', 'if a battery capacity is rated at 280 Ah, then one C rate is 280 Amps, and 0.1 C is 28 Amps'),
          f(97, 'DER: Distributed Energy Resource, any power source connected to the grid. Connected to the grid, the Sanctuary is a DER.', 'DER: Distributed Energy Resource - any power source connected to the grid'),
          f(98, 'EPS: Emergency Power Supply, also called a microgrid. It can generate electricity off-grid or connected to the grid.', 'EPS (Emergency Power Supply, aka microgrid)'),
          f(98, 'MLPE: Module Level Power Electronics. Rapid Shutdown Devices and optimizers are two kinds.', 'Rapid Shutdown Devices and optimizers are two kinds of MLPE'),
          f(98, 'MPPT: Maximum Power Point Tracking, a DC to DC converter that extracts the maximum solar power available.', 'This is a type of DC to DC power converter that is able to extract the maximum solar power available'),
        ],
      },
      {
        heading: 'Solar and meters',
        facts: [
          f(99, 'A PV meter measures solar production only.', 'This meter is for measuring solar production only'),
          f(99, 'Home solar panels are typically rated 300 to 600 W, about 15% to 25% efficient, with 30 V to 80 V output per panel.', 'Output voltage varies from 30 V to 80 V per panel'),
          f(99, 'TOU: Time of Use. The inverter has six time slots where the battery behavior can change through the day.', 'The inverter has six different time slots where the battery behavior may be changed throughout the day'),
        ],
      },
    ],
    questions: [
      q(97, 'What does AHJ stand for?', 'Authority Having Jurisdiction', ['Approved Home Journal', 'Alternating Hybrid Junction', 'Authorized Hardware Journal'], 'AHJ (Authority Having Jurisdiction)'),
      q(99, 'What does PTO stand for in this manual?', 'Permission To Operate', ['Power Transfer Output', 'Peak Temperature Over-limit', 'Primary Transformer Outlet'], 'PTO: Permission To Operate'),
      q(99, 'Where is the PCC, the Point of Common Coupling?', 'Basically at the utility billing meter', ['At the inverter\'s PV disconnect', 'At the battery breaker', 'At the backup loads panel'], 'It\'s basically at the utility billing meter'),
      q(97, 'A battery is rated 280 Ah. How many amps is 0.1 C?', '28 A', ['2.8 A', '280 A', '2,800 A'], 'if a battery capacity is rated at 280 Ah, then one C rate is 280 Amps, and 0.1 C is 28 Amps'),
      q(98, 'What is another name for an EPS, an Emergency Power Supply?', 'A microgrid', ['A transfer switch', 'A net meter', 'A rapid shutdown device'], 'EPS (Emergency Power Supply, aka microgrid)'),
      q(98, 'Which are two kinds of MLPE?', 'Rapid Shutdown Devices and optimizers', ['Net meters and PV meters', 'Inverters and batteries', 'CTs and transfer switches'], 'Rapid Shutdown Devices and optimizers are two kinds of MLPE'),
      q(99, 'What does a PV meter measure?', 'Solar production only', ['Power used by the home only', 'Power sold back to the grid only', 'Battery state of charge'], 'This meter is for measuring solar production only'),
      q(99, 'How many time slots does the inverter have for Time of Use?', 'Six', ['Two', 'Four', 'Twelve'], 'The inverter has six different time slots where the battery behavior may be changed throughout the day'),
      q(97, 'In the manual, what is a DER?', 'Any power source connected to the grid, which the Sanctuary is when grid-connected', ['A device that reads current in a wire', 'A solar panel with built-in electronics', 'The authority that approves the installation'], 'DER: Distributed Energy Resource - any power source connected to the grid'),
    ],
  },
]
