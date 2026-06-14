SUPSI 2026  
Corso d’interaction design, CV429.01  
Docenti: A. Gysin, G. Profeta  

Progetto 2: Un piccolo passo per un uomo, un grande balzo per l'umanità

# Titolo progetto
Autore: Riccardo Vosti \
[NASA 70](https://github.com/ixd-supsi/2026/tree/main/esempi/es06_array_7)


## Introduzione e tema
Il progetto nasce con l'obiettivo di celebrare il 70° anniversario della NASA attraverso la creazione di uno spazio digitale interattivo. Non si tratta di un semplice catalogo lineare, ma di un vero e proprio ecosistema esplorativo progettato per accogliere una vasta collezione di progetti e documentazioni. La piattaforma trasforma l'utente da spettatore passivo a esploratore attivo, richiedendo un'interazione spaziale diretta per svelare i contenuti.
Il tema centrale del progetto è il parallelismo tra l'esplorazione dell'universo e l'esplorazione dello spazio digitale. Per bilanciare questa vastità senza generare caos visivo, l'interfaccia si fonda su un'estetica minimalista e rigorosa, di forte ispirazione Swiss International Style. L'utilizzo di una griglia rigida e inflessibile (la matrice 16x7) fa da scheletro all'intera esperienza, imponendo ordine e proporzione. La palette cromatica ad alto contrasto — dominata da neri profondi, grigi tecnici e accenti di rosso NASA — unita a una tipografia essenziale, riflette la precisione ingegneristica e strumentale che da sempre contraddistingue le missioni aerospaziali.


## Riferimenti progettuali
Dolor sit amet consectetur adipiscing elit duis tristique. Sociis natoque penatibus et magnis dis parturient montes nascetur. Est sit amet facilisis magna. Tellus rutrum tellus pellentesque eu. Dictum sit amet justo donec enim. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Sed faucibus turpis in eu mi bibendum neque egestas congue. Tellus in metus vulputate eu scelerisque felis imperdiet proin. Dolor magna eget est lorem ipsum dolor. Sit amet mattis vulputate enim nulla. Elit pellentesque habitant morbi tristique senectus et. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa.

[<img src="imgs/missioncontrol.jpg" width="500" alt="Mission control panel">]()


## Design dell’interfaccia e modalità di interazione
Una mappa da esplorare, non una pagina da scorrere
Invece del classico scorrimento verticale dall'alto verso il basso, il sito è progettato come un'ampia tela navigabile. Tutti i progetti sono organizzati in una griglia 16x7 ordinata e geometrica. L'idea è quella di dare all'utente la sensazione di muoversi liberamente su una mappa interattiva o su un monitor di navigazione.  Colori essenziali e atmosfera spaziale
L'estetica del sito va dritta al punto: lo sfondo è nero profondo e i testi sono chiari. L'unico colore che spicca veramente è il rosso ufficiale della NASA, che viene usato solo per indicare gli elementi interattivi, come i bottoni o le schede selezionate. È un look molto pulito che ricorda i vecchi terminali delle sale di controllo spaziali.  I caratteri giusti per i dati giusti
Per i testi ho usato solo due tipi di carattere:  Un font pulito e moderno (Inter) per i titoli e le descrizioni, per garantire la massima facilità di lettura.Un font in stile "macchina da scrivere" (Roboto Mono) per le date, i tag e i metadati, scelto appositamente per dare al sito l'aspetto di un vero archivio scientifico.  Tutto in una sola schermata
Per mantenere l'esperienza fluida, quando si clicca su un progetto non si viene mai mandati su un'altra pagina. Si apre semplicemente un pannello laterale che sposta delicatamente la griglia, permettendo di leggere i dettagli senza perdere mai il punto in cui ci si trovava. Anche i piccoli dettagli seguono questa logica interattiva: ad esempio, il logo NASA nel menu non è una semplice immagine, ma un piccolo "gioco" di pixel luminosi che reagisce al passaggio del mouse.  

https://github.com/user-attachments/assets/38d1768e-a90e-45dd-b12b-1ac0aa1151b3

[<img src="doc/cards.gif" width="500" alt="Magic trick">]()


## Tecnologia usata
HTML5 & CSS3: Utilizzati per definire la struttura semantica della pagina e per gestire l'intero sistema di griglia (matrice 16x7) tramite il modulo CSS Grid.

JavaScript: Ho preferito l'uso di JavaScript puro per mantenere il codice leggero e performante, senza il sovraccarico di framework pesanti. Il linguaggio gestisce:

La dinamica di zoom e pan (spostamento) sulla griglia.

Il sistema di filtraggio dei progetti in tempo reale.

La logica dell'animazione per il logo interattivo.

Google Fonts: Utilizzato per integrare i font Inter e Roboto Mono.

JSON: Per raccogliere i vari progetti a tal modo di creare un CMS con i progetti, un metodo semplice per poi aggiungerne altri.


```JavaScript
const image = new Image();
image.onload = () => {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(
		gl.TEXTURE_2D,
		level,
		internalFormat,
		srcFormat,
		srcType,
		image
	);
	if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
		gl.generateMipmap(gl.TEXTURE_2D);
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}
};
image.src = url;
```

## Target e contesto d’uso
Il target di riferimento principale è costituito da utenti tra i 15 e i 30 anni, appassionati dello spazio e della NASA, alla ricerca di un'esperienza divulgativa interattiva. Tuttavia, il vero filtro d'accesso all'archivio non è l'età anagrafica, bensì l'alfabetizzazione digitale: l'interfaccia richiede una certa familiarità con i pattern di navigazione web contemporanei (zoom, drag & pan). Questo rende l'esperienza pienamente accessibile a chiunque — indipendentemente dall'età — possieda la giusta dimestichezza con l'esplorazione digitale.

[<img src="doc/munari.jpg" width="300" alt="Supplemento al dizionario italiano">]()
