'use strict';
import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import './intendedList.css';

const agbs = <ol className='intended'>
  <li><h3>Allgemeine Informationen, Vertragspartner, Veranstaltungsort, Teilnehmer, Sporttauglichkeit</h3>
    <ol>
      <li>Vertragspartner der hier angebotenen Dienstleistung ist:
        Freya Constanze Heine, Rehstieg 1, 21442 Toppenstedt</li>
      <li>Soweit das Trainingsprogramm keine Abweichungen vorsieht,
        ist der Veranstaltungsort das FreyRaum Studio Tangendorfer Straße 2a, 21442 Toppenstedt,
        betrieben von Freya Heine. Die Trainingseinheiten werden grundsätzlich in der oben genannten
        Trainingsstätte durchgeführt. Änderungen des Veranstaltungsortes bleiben vorbehalten und werden
        rechtzeitig auf der Webseite (www.freya.fitness) oder per Aushang am Veranstaltungsort bekannt
        gegeben. Die jeweiligen Öffnungs- bzw. Trainingszeiten finden sich ebenfalls auf der Webseite.
        Des Weiteren ist die jeweilige Hausordnung zu beachten.</li>
      <li>Die vereinbarte Kursbetreuung versteht sich als zeitbestimmte,
        dienstvertragliche Verpflichtung gemäß § 611 BGB.</li>
      <li>Teilnehmer müssen grundsätzlich 18 Jahre alt sein.
        Freya Heine behält sich jedoch die Entscheidung im Einzelfall vor,
        Minderjährigen das Training zu ermöglichen. In diesem Fall ist bei Abschluss
        des Vertrages/ dem Anmelden beim Probetraining/ dem Kauf einer „10er Karte“
        unbedingt die Einverständniserklärung der Erziehungsberechtigten beizufügen bzw. vorzulegen.</li>
      <li>Der Teilnehmer versichert gegenüber Freya Heine, sportgesund zu sein und ist verpflichtet,
        sich selbst darüber zu informieren, ob die Teilnahme am Trainingsbetrieb mit
        gesundheitlichen Risiken verbunden ist. Freya Heine empfiehlt eine ärztliche
        Sporttauglichkeitsuntersuchung vor und während der jeweiligen Vertragslaufzeit</li>
    </ol>
  </li>

  <li><h3>Training</h3>
    <ol>
      <li>Die Dauer eines Kurses beträgt i. d. R. 60 Minuten.</li>
      <li>Die Anmeldung zu den Trainingseinheiten erfolgt online auf Basis eines Anmeldesystems,
      welches den Teilnehmern auf der oben genannten Webseite zur Verfügung steht.
      Sollte ein Training bereits ausgebucht sein, muss der Teilnehmer auf eine andere Trainingszeit
      ausweichen. Es gelten die jeweiligen Buchungsregeln des Kurses, welche auf der Website
        einzusehen sind.</li>
      <li>Eine ordentliche Abmeldung des Teilnehmers kann bis 3 Stunden vor Kursbeginn erfolgen.
      Eine außerordentliche Abmeldung ist bei Nachweis eines wichtigen Grundes (Krankheit,
      Sportuntauglichkeit) möglich. Dem jeweiligen Trainer bleibt die Möglichkeit offen, einen
        entsprechenden Nachweis einzufordern.</li>
      <li>Bei Nichteinhaltung der ordentlichen Abmeldefrist von 3 Stunden (s. 2.3) wird der Kurs von
      dem jeweiligen Buchungskontingent (bei 10er Karten) abgezogen. Zusätzlich fällt eine Stornogebühr von 4 Euro an.
        Freya Heine behält sich vor, diese bei Nichtzahlung per Lastschrift einzuziehen.
      Eine ordentliche Abmeldung im Bereich „Personaltraining“, „Food Coaching“ und „Team
      Training“ kann bis 6 Stunden vor Kursbeginn erfolgen. Eine außerordentliche Abmeldung ist
      bei Nachweis eines wichtigen Grundes (Krankheit, Sportuntauglichkeit) möglich. Dem
      jeweiligen Trainer bleibt die Möglichkeit offen, einen entsprechenden Nachweis einzufordern.
      Art, Umfang und Ort der jeweiligen Trainingseinheit bestimmt der Trainer, wobei den
      Teilnehmern der jeweilige Trainingsinhalt vor Trainingsbeginn erläutert und mit ihnen
        einvernehmlich abgestimmt wird.</li>
      <li>Der Teilnehmer ist für eine entsprechende Sportbekleidung/Wetterbekleidung selbst
        verantwortlich.</li>
      <li>Den Anweisungen des Trainers ist Folge zu leisten.</li>
      <li>Der Trainer ist berechtigt, den Teilnehmer vom weiteren Training auszuschließen, sofern
      dieser den Trainingsbetrieb umfassend stört oder dieses aus gesundheitlichen Gründen
        erforderlich erscheint.</li>
      <li>Außerhalb der Trainingszeiten kann Freya Heine Mo-Fr zwischen 8:00 und 20:00 Uhr
      per Telefon, E-Mail und anderen Medien kontaktiert werden. Hieraus ergibt sich jedoch kein
        Anspruch auf ständige Erreichbarkeit der jeweiligen Trainer.</li>
    </ol>
  </li>

  <li><h3>Mindestvertragslaufzeit, Kündigung</h3>
    <ol>
      <li>Eine „10er Karte“ verliert 10 Monate nach Vertragsabschluss seine Gültigkeit und verlängert
        sich nicht.</li>
      <li>„Drop-In“-Tickets (Day) gestatten dem Teilnehmer eine einmalige Teilnahme an einem Kurs
        bzw. Gruppentraining.</li>
      <li>Die angebotenen Verträge (mit Ausnahme der „10er Karte“) haben eine Mindestlaufzeit von 3 Monaten.
        Die Mitgliedschaft kann immer mit einer Frist von 3 Monaten zum Monatsende gekündigt werden.</li>
      <li>Im Fall von Preiserhöhungen hat das Mitglied ein Sonderkündigungsrecht nach Ziff. 5.2.</li>
      <li>Das Recht zur fristlosen Kündigung aus wichtigem Grund bleibt beiderseitig bestehen. Bei
        fristloser Kündigung, obliegt diesem der Nachweis des wichtigen Grundes: bei Krankheit oder
        Schwangerschaft ist die Vorlage eines ärztlichen Attests über die langfristige
        Sportuntauglichkeit erforderlich, bei Umzug in eine andere Stadt die Vorlage der
        Meldebescheinigung, bei sonstigen Gründen muss das Mitglied/Teilnehmer einen
        entsprechend geeigneten Nachweis erbringen. Die Kündigungsfrist bei Inanspruchnahme des
        Sonderkündigungsrechts beträgt 4 Wochen zum Monatsende.</li>
      <li>Während der Vertragslaufzeit (Ausschluss „10er Karten“) besteht die Möglichkeit eines
        „Ruhemonats“. Dieser muss 14 Tage vor Beginn schriftlich angekündigt werden und kann innerhalb eines
        Jahres nur einmal in Anspruch genommen werden. Bei Inanspruchnahme wird die Vertragslaufzeit um den
        jeweiligen Monat verlängert.</li>
      <li>Eine Vertragsübernahme ist nicht möglich.</li>
    </ol>
  </li>

  <li><h3>Geltungsbereich</h3>
    <ol>
      <li>Die AGB gelten für sämtliche Vertragsbeziehungen zwischen Freya Heine und dem
        Teilnehmer in der zum Zeitpunkt des Vertragsschlusses aktuellen Fassung. Jeder Teilnehmer,
        der an den FreyRaum-Trainingseinheiten teilnehmen möchte, schließt in den Räumlichkeiten
        des Veranstaltungsortes einen Vertrag ab oder erwirbt eine „10er Karte“. Darüber hinaus
        besteht die Möglichkeit, ein einmaliges kostenloses Probetraining nach vorheriger Anmeldung
        zu absolvieren.</li>
      <li>Im Rahmen des Vertrages werden die persönlichen Kontaktdaten des Teilnehmers erfragt.
        Eventuelle Zahlungen werden direkt vor Ort getätigt oder mit einer vorort bestimmten Frist
        im Anschluss des Gespräches.</li>
      <li>Mit dem Erwerb einer „10er Karte“, dem Abschluss eines Vertrages oder der
        Teilnahme am kostenfreien Probetraining, akzeptiert der Teilnehmer die allgemeinen
        Geschäftsbedingungen. Die AGB liegen in den Räumlichkeiten des Veranstaltungsortes aus.</li>
      <li>Die Darstellung des Trainingsprogramms stellt kein Angebot i.S.d. § 145 BGB dar, sondern
        stellt lediglich die Aufforderung zur Abgabe eines Angebots dar. Es ist freibleibend sowie
        unverbindlich und ist insbesondere vom aktuellen Kursangebot und der Teilnehmeranzahl
        abhängig. Mit Unterschrift unter dem Vertrag/ dem Kauf einer „10er Karte“, „Drop-In“ bzw.
        dem Anmelden zum ersten kostenfreien Probetraining, meldet sich der Teilnehmer verbindlich
        an. Freya Heine kann ohne Angabe von Gründen das Angebot ablehnen.
        Eine Stornierung der gebuchten Leistung ist nur bedingt möglich (s. Ziff. 2.3).</li>
    </ol>
  </li>

  <li><h3>Preise</h3>
    <ol>
      <li>Alle vereinbarten Preise enthalten die gesetzliche Umsatzsteuer von 19%. Bei Änderung der
        gesetzlichen Umsatzsteuer, ist der Teilnehmer/ das Mitglied zur Zahlung des entsprechend
        erhöhten Beitrages verpflichtet. Nach Ablauf der 3-monatigen Mindestvertragslaufzeit behält sich
        Freya Heine vor, unter Einhaltung einer Vorankündigungsfrist von mindestens einem Monat
        zum Monatsende, die Beiträge zu erhöhen. In diesem Fall steht dem Mitglied ein
        Sonderkündigungsrecht zum Zeitpunkt des Inkrafttretens der Beitragserhöhung zu.</li>
    </ol>
  </li>

  <li><h3>Zahlungsbedingungen</h3>
    <ol>
      <li>Die Zahlung der Gebühr der „10er Karte“ ist bis spätestens zum 1. des auf den Vertragsabschluss
        folgenden Monats auf das Konto von Freya Heine zu leisten.</li>
      <li>Die Zahlung der Mitgliedschaft ist je nach Absprache bei Vertragsabschluss bis spätestens zum 1. oder
        zum 15. Eines jeden Monats auf das Konto von Freya Heine zu leisten.</li>
      <li>Die vertraglich fest gelegte Anmeldegebühr muss spätestens mit dem ersten Monats des Mitgliedschaftsbeitrags
        überwiesen werden.</li>
    </ol>
  </li>

  <li><h3>Haftung</h3>
    <ol>
      <li>Freya Heine haftet nicht für etwaige Nichterreichung des vom Teilnehmer/ Mitglied mit der
        Eingehung des Vertrages verfolgten Zwecks.</li>
      <li>Freya Heine haftet nicht für die vom Teilnehmer/ Mitglied selbst verursachten Schäden aus
        der Verletzung des Lebens, des Körpers oder der Gesundheit, es sei denn, diese beruhen auf
        fahrlässiger oder vorsätzlicher Pflichtverletzung von Freya Heine, seiner Vertreter bzw. seiner
        Erfüllungsgehilfen, insbesondere der Trainer.</li>
      <li>Freya Heine haftet nicht für Sachschäden oder den Verlust von Sachen des Teilnehmers/
        Mitglieds, es sei denn Freya Heine, ihre Vertreter bzw. ihre Erfüllungsgehilfen oder
        Trainer haben diese Schäden grob fahrlässig oder vorsätzlich verursacht.</li>
      <li>Freya Heine empfiehlt den Teilnehmern/ Mitgliedern sich eigenverantwortlich gegen Unfälle
        und Verletzungen, die beim Training oder auf dem Weg von und zum Training entstehen
        können, zu versichern.</li>
      <li>Soweit eine Haftung für Schäden, die nicht auf der Verletzung des Lebens, Körpers oder der
        Gesundheit des Teilnehmers/ Mitglieds beruhen, für leichte Fahrlässigkeit nicht
        ausgeschlossen sind, verjähren diese Ansprüche innerhalb eines Jahres beginnend mit der
        Entstehung des Anspruchs.</li>
      <li>Sofern Freya Heine aufgrund einer Vereinbarung im Einzelfall Sachen verkauft (z.B.
        Sportbekleidung, -geräte, etc.) oder den Verkauf solcher Sachen vermittelt, so verjähren
        etwaige Mängelansprüche des kaufenden Teilnehmers/Mitglieds gegen Freya Heine
        abweichend von der gesetzlichen Regelung nach einem Jahr, es sei denn, der Mangel wurde
        arglistig verschwiegen.</li>
      <li>Muss Freya Heine eine Veranstaltung bzw. einen Kurs aufgrund unverschuldeter und
        unvorhergesehener Umstände (z.B. Wetter, kurzfristige Trainererkrankung, etc.) verlegen
        oder absagen, stehen dem Mitglied keine Ersatzansprüche zu.</li>
    </ol>
  </li>

  <li><h3>Datenschutz</h3>
    <ol>
      <li>Im Zuge der Vertragsunterzeichnung erklärt der Teilnehmer/ das Mitglied sein Einverständnis
        zur Speicherung der personenbezogenen Daten. Die erhobenen Daten werden ausschließlich
        zur Erfüllung des Vertrages verwendet und nicht an Dritte weitergegeben.</li>
      <li>Der Teilnehmer/ das Mitglied erklärt sich damit einverstanden, dass Freya Heine das
        entstandene Foto- und Videomaterial im Rahmen der Öffentlichkeitsarbeit nutzen darf.</li>
      <li>Zum Zwecke der Kredit- und Bonitätsprüfung wird von Freya Heine ggf. ein Datenaustausch
        mit dem jeweiligen Kreditdienstleistungsunternehmen vorgenommen.</li>
      <li>Der Teilnehmer/ das Mitglied ist damit einverstanden, dass Freya Heine bei Bedarf
        entsprechende Daten per E-Mail an diesen heranträgt.</li>
      <li>Jeder Teilnehmer/ Jedes Mitglied hat das Recht, jederzeit über
        die gespeicherten Daten Auskunft zu verlangen und gegebenenfalls löschen zu lassen.</li>
    </ol>
  </li>

  <li><h3>Schlussbestimmungen</h3>
    <ol>
      <li>Änderungen, Ergänzungen oder Nebenabreden bedürfen zu ihrer Wirksamkeit der
        Schriftform. Dies gilt auch für das Schriftformerfordernis selbst.</li>
      <li>Sollte eine der Bestimmungen der AGB unwirksam oder undurchführbar sein bzw. werden,
        bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.</li>
      <li>Beide Vertragsparteien sind zu gegenseitiger Loyalität verpflichtet und werden sich nicht
        herabwürdigend über die Person bzw. Dienstleistungen äußern, auch nicht gegenüber Dritten.</li>
      <li>Es gilt das Recht der Bundesrepublik Deutschland.</li>
    </ol>
  </li>
</ol>;

class Agb extends Component {

  render() {
    return (
      <div style={{height: '100%', overflow: 'scroll', WebkitOverflowScrolling: 'touch'}}>
        <Grid container spacing={16} justify="center" style={{height: '100%', width: '100%', margin: '0px'}}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={'Allgemeine Geschäftsbedingungen'}/>
              <CardMedia src={__API__ + '/about_freya.png'}/>
              <CardContent>
                <div>
                  <p>
                    Freya Heine<br/>
                    Tangendorfer Straße 2a<br/>
                    21442 Toppenstedt
                  </p>
                  <p>
                    0151 20712506<br/>
                    https://freya.fitness<br/>
                    freyraum@freya.fitness
                  </p>
                </div>
                {agbs}
                <div style={{textAlign: 'right'}}>
                  <h3>Toppenstedt, 2018</h3>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Agb;