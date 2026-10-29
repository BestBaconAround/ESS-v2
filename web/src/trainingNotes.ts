/**
 * The author's own notes for the Training pages: how to take a call, how to work through the common problems, and the
 * questions customers ask most. The wording is the author's, with the grammar tidied. Nothing here has been checked
 * against the Technical Service Manual, and the manual wins where they differ. Keep it free of personal contact
 * details (no names, emails or phone numbers): the site is public.
 */

/** A paragraph, or a list of short lines (a checklist of what to check, or the steps in order). */
export type NoteBlock = { p: string } | { list: string[] }

export interface NoteSection {
  id: string
  heading: string
  blocks: NoteBlock[]
}

export interface NotesPage {
  title: string
  lead: string
  sections: NoteSection[]
}

export const TAKING_A_CALL: NotesPage = {
  title: 'Taking a call',
  lead: 'How a support call starts, and one worked example from first message to likely causes.',
  sections: [
    {
      id: 'first-call',
      heading: 'First call approach',
      blocks: [
        {
          list: [
            'Hello, thank you for calling Lion Energy. This is (name). Do you need help with the Sanctuary system?',
            "They'll usually start ranting about the system.",
            'The first thing we need to find out on the call is whether the caller is a homeowner or a technician.',
            "Then we need the name on the system. Most of the time it's the homeowner's name.",
            "We can also search by street address or communicator name, or find it under the installer's company.",
            'Once we find the system, we can start troubleshooting.',
          ],
        },
      ],
    },
    {
      id: 'example-power-off',
      heading: 'Example: the power keeps going off',
      blocks: [
        {
          list: [
            'A homeowner texted in to tell us that her power keeps going off.',
            "First, I'm going to go to her Sanctuary and open up some tabs: her settings page, alarms page, and compare page.",
            'We have an alert for A2_11, BMS communication failure.',
            "I'm going to figure out which battery has stopped communicating. I'll plot all the battery voltages and find which battery isn't communicating.",
            "I see that battery #1 isn't showing any values. This is our problem battery.",
            "Now we need to troubleshoot, and we can't do this alone. We'll need a technician to come out.",
            "I'm going to go ahead and read battery #1's register and verify that it is down, which it is.",
            "I'll send a battery activation request and see if that helps.",
          ],
        },
      ],
    },
    {
      id: 'why-battery-comm-lost',
      heading: 'What can happen when we lose battery communication?',
      blocks: [
        {
          list: [
            'A cable that has gone bad.',
            'Water that got inside the battery and damaged the BMS.',
            'A drifted low cell that put the BMS to sleep.',
            'A tripped battery breaker.',
            'A bad BMS port.',
            'A faulty BMS.',
          ],
        },
      ],
    },
  ],
}

export const TROUBLESHOOTING: NotesPage = {
  title: 'Troubleshooting by problem',
  lead: 'What to check for the problems that come up most often.',
  sections: [
    {
      id: 'battery-comm',
      heading: 'Battery loss of communication',
      blocks: [{ list: ['Check the BMS cable.', 'Check for water intrusion.', 'Is the battery voltage above 51 V?', 'Is the breaker tripped?', 'Does the battery have a drifted low cell?'] }],
    },
    {
      id: 'parallel-comm',
      heading: 'Parallel communication fault',
      blocks: [
        {
          list: [
            'Check the cable from parallel B to parallel A.',
            'Is the inverter on?',
            "If the inverter power button is pushed in but there are no lights, check for battery voltage at the inverter, grid, and solar.",
            'If voltage is present but the normal light is off, take off the top cover and look for any burn spots.',
          ],
        },
      ],
    },
    {
      id: 'solar-low',
      heading: 'Solar production low',
      blocks: [
        {
          list: [
            'Ask the technician on site how many strings are going to the inverters.',
            "Go to the homeowner's Sanctuary and go to Compare. Plot all the PV voltages.",
            "Look for the string that isn't producing.",
            'Check the MPPT fuse with a multimeter. A good fuse will have a resistance value. OL is an open circuit, and the fuse needs to be replaced.',
            'The Sanctuary system often has a Tigo system installed by the technician. Tigo has its own troubleshooting team.',
          ],
        },
      ],
    },
    {
      id: 'grid-high',
      heading: 'Grid voltage too high',
      blocks: [{ list: ['Adjusting the grid voltage register to 107% and enabling HVRT can help.'] }],
    },
    {
      id: 'grid-low',
      heading: 'Grid voltage too low',
      blocks: [{ list: ['Plot grid voltage to verify there is no voltage.', "Check the grid feed breaker for the inverter. If it's tripped, turn it back on."] }],
    },
  ],
}

export const COMMON_QUESTIONS: NotesPage = {
  title: 'Common questions',
  lead: 'The questions customers ask most, and the short answers.',
  sections: [
    {
      id: 'offline',
      heading: 'My system is offline',
      blocks: [{ list: ['Press the reset button on the communicator and wait a few minutes.', 'The status light should be solid blue for the EMS-C, or green for the WCM.'] }],
    },
    {
      id: 'no-access',
      heading: "I can't access my system",
      blocks: [{ list: ['Locate their Sanctuary and ask for their email.', 'Under their Sanctuary, click Shared access, enter their email, and send.'] }],
    },
    { id: 'specs', heading: 'What are the specs of my system?', blocks: [{ list: ['Refer to the manual for specifications.'] }] },
    {
      id: 'share-access',
      heading: 'How can I share access?',
      blocks: [
        {
          list: [
            'In the browser, under their Sanctuary, click the hamburger button at the top right and click Shared access.',
            "They can enter a person's email to share their system.",
          ],
        },
      ],
    },
    {
      id: 'more-solar',
      heading: 'Can I add more solar to my system?',
      blocks: [{ list: ['Ask what their solar capacity is.', 'Gen2 only accepts 12 kW of solar per inverter, and Gen3 accepts 18 kW.'] }],
    },
    {
      id: 'warranty',
      heading: 'What is my warranty?',
      blocks: [{ list: ['Every Sanctuary system gets a 10-year warranty.', 'It covers the site visit to replace the defective item and some labor.'] }],
    },
  ],
}
