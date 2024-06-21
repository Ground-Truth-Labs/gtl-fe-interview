import './Results.css'

enum Quality {
  High = "high",
  Medium = "medium",
  Low = "low",
}

// The numbering represents the order the events are expected to occur,
// First is the baseline, then the follow-up, and finally the conclusion.
// All event's may not be present, but when they are, the earlier event will always be present.
enum Event {
    Baseline = "Baseline",
    FollowUp = "FollowUp",
    Conclusion = "Conclusion"
}

const eventOrder = {
    [Event.Baseline]: 1,
    [Event.FollowUp]: 2,
    [Event.Conclusion]: 3,
}

interface Result {
  patientId: string; // the client specific identifier
  scannedAt: Date; // the time at which the sample was digitally scanned
  score: number; // the score of the sample
  event: Event; // the event that the sample was taken at
  sampleQuality: Quality; // the quality of the sample
  dateOfBirth: string; // the date of birth of the patient
}

// please do not edit the data, unless to add further examples
const data: Result[] = [
  {
    patientId: "87gd2",
    scannedAt: new Date("2021-08-03T12:00:00Z"),
    score: 0.81,
    event: Event.FollowUp,
    sampleQuality: Quality.Low,
    dateOfBirth: "1990-01-01",
  },
  {
    patientId: "87gd2",
    scannedAt: new Date("2021-08-01T12:00:00Z"),
    score: 0.92,
    event: Event.Baseline,
    sampleQuality: Quality.High,
    dateOfBirth: "1990-01-01",
  },
  {
    patientId: "87gd2",
    scannedAt: new Date("2021-08-08T12:00:00Z"),
    score: 0.43,
    event: Event.Conclusion,
    sampleQuality: Quality.Low,
    dateOfBirth: "1990-01-01",
  },
  {
    patientId: "js27h",
    scannedAt: new Date("2021-08-02T12:00:00Z"),
    score: 0.74,
    event: Event.Baseline,
    sampleQuality: Quality.Medium,
    dateOfBirth: "1993-02-12",
  },
  {
    patientId: "9782e",
    scannedAt: new Date("2021-08-03T12:00:00Z"),
    score: 0.25,
    event: Event.Baseline,
    sampleQuality: Quality.Medium,
    dateOfBirth: "1981-04-12",
  },
  {
    patientId: "9782e",
    scannedAt: new Date("2021-08-21T12:00:00Z"),
    score: 0.21,
    event: Event.FollowUp,
    sampleQuality: Quality.High,
    dateOfBirth: "1981-04-12",
  },
];

const perPatientData = data.reduce<Record<string, Omit<Result, "dateOfBirth" | "patientId">[]>>((acc, item) => {
    const { patientId, dateOfBirth, ...rest } = item
    if (patientId in acc) {
        acc[patientId].push(rest)
    } else {
        acc[patientId] = [rest]
    }
    return acc
}, {})

const qualityColor: Record<Quality, string> = {
    [Quality.High]: '#393',
    [Quality.Medium]: '#963',
    [Quality.Low]: '#933',
}

export const PatientResults = ({
    patientId,
    results
}: { patientId: string, results: { score: number, scannedAt: Date, event: Event, sampleQuality: Quality }[]}) => {
    return (
    <div className='result-card'>
        <p><span className="label">PatientID</span> <span>{patientId}</span></p>
        <div className="patient-events">
            {results.sort((a, b) => eventOrder[a.event] - eventOrder[b.event]).map(({ score, scannedAt, event, sampleQuality }) => (
                <div className="event">
                    <div className="event-header">
                    <h4>{event}</h4>
                    <p className="event-date">{scannedAt.toLocaleDateString()}</p>
                    </div>
                    <h2>{score}</h2>
                    <p>Quality <span style={{color: qualityColor[sampleQuality]}}><strong>{sampleQuality.toUpperCase()}</strong></span></p>
                </div>
            ))}
            { Array.from({ length: 3 - results.length }).map((_, i) => (
                <div className="event" style={{background: "#FAFAFA"}}><p style={{color: "#AAA"}}>Missing</p></div>))
            }
        </div>
    </div>
);
}


export default function Results() {
    return (
        <div className="results">
        {Object.entries(perPatientData).map(([patientId, patientResults]) => {
            return (
                <PatientResults patientId={patientId} results={patientResults} />
            );
        })}
        </div>
    )
}
