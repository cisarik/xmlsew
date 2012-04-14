<?php header('Content-Type: text/html; charset=utf-8'); ?>

	<div id="xmlsewphpnavbar" class="navbar navbar-static">
            <div class="navbar-inner">
              <div class="container" style="width: auto;">
                <ul class="nav">
                  <li><a href="#namespaces">Jmenné prostory</a></li>
                  <li><a href="#connect">Připojení XML schématu k dokumentu</a></li>
                  <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Prvky jazyka XML Schema <b class="caret"></b></a>
                    <ul class="dropdown-menu">
                      <li><a href="#root">Kořenový element</a></li>
                      <li><a href="#elements">Elementy</a></li>
                      <li><a href="#attributes">Atributy</a></li>
                      <li><a href="#attributegroup">Skupina atributů</a></li>
                      <li><a href="#xpath">Omezení identity</a></li>
                      <li><a href="#anyattribute">Zástupci</a></li>
                      <li><a href="#notation">Notace</a></li>
                      <li><a href="#anotation">Anotace</a></li>
                    </ul>
                  </li>
                  <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Jednoduché dátové typy<b class="caret"></b></a>
                    <ul class="dropdown-menu">
                      <li><a href="#datatypes_basic">Základní datové typy</a></li>
                      <li><a href="#datatypes_string">Odvozené od typu string</a></li>
                      <li><a href="#datatypes_decimal">Odvozené od typu decimal</a></li>
                    </ul>
                  </li>
                  
                  <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Odvozené typy<b class="caret"></b></a>
                    <ul class="dropdown-menu">
                      <li><a href="#restricion">Restrikcí</a></li>
                      <li><a href="#list">Seznamem</a></li>
                      <li><a href="#union">Sjednocením</a></li>
                    </ul>
                  </li>
                  
                  <li class="dropdown">
                    <a href="#datatypes-complex" class="dropdown-toggle" data-toggle="dropdown">Složené datové typy<b class="caret"></b></a>
                    <ul class="dropdown-menu">
                      <li><a href="#complextype">Definice</a></li>
                      <li><a href="#simplecontent">S jednoduchým obsahem</a></li>
                      <li><a href="#complexcontent">Se složeným obsahem</a></li>
                      <li><a href="#sequence">Posloupnost elementů</a></li>
                      <li><a href="#choice">Výběr z elementů</a></li>
                      <li><a href="#all">Množina elementů</a></li>
                      <li><a href="#group">Modelová skupina</a></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div id="xmlsewphpcontent" data-spy="scroll" data-target="#xmlsewphpnavbar" class="scrollspy" style="overflow: auto;padding-left:31px;margin-top:-18px;background-color:white;">
          	<br>
          	<br>
            <h3>XML Schéma</h3>
            <br>
            
            <h4 id="namespaces">Jmenné prostory</h4>

<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <cenik:nabidka xmlns:cenik="www.ceniky.cz/e-cenik"
                    xmlns:bib="www.knihy.cz/bibliografie">
       <cenik:polozka cenik:dph="22%">
         <cenik:nazev>
           <bib:kniha>
             <bib:nazev>Steve Jobs</bib:nazev>
             <bib:autor>Walter Isaacson</bib:autor>
           </bib:kniha>
         </cenik:nazev>
       </cenik:polozka>
     </cenik:nabidka>  
  </code>
</pre>
</div>
            <p>
            Jmenný prostor je prostředí, ve kterém jsou všechna jména elementů a v kontextu jednoho elementu i jména atributů unikátní. Jmenné prostory jsou jednoznačně identifikovány svým URI6 a umožňují definovat XML schéma pomocí různých sad značek (tj. množin elementů a atributů).
Jmenné prostory pro element a jeho podelementy určíme prostřednictvím atributu xmlns:<b> «prefix»=«URI sady značek»</b>. Při použití elementu nebo atributu z daného jmenného prostoru pak přidáme před jeho název námi definovaný prefix – <b>«prefix»:«název elementu»</b> nebo <b>«prefix»:«název atributu»</b>. Pro zjednodušení je možné považovat jednu sadu značek za implicitní. V tom případě pro ni nespecifikujeme a nepoužíváme prefix. Další zjednodušení plyne z možnosti předefinování jmenného prostoru v podelementech.
            </p>
            <h4 id="connect">Připojení XML schématu k dokumentu</h4>

<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
      <KorenovyElement
         xmlns="http://www.pr.cz/MojeSchema"
         xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"
         xs:schemaLocation="http://www.pr.cz/MojeSchema mojeSchema01.xsd">
      </KorenovyElement>
  </code>
</pre>
</div>
            

            <p>
           	Určení XML schématu příslušejícího danému XML dokumentu je možné provést dvěma způsoby. Pokud má odpovídající XML schéma definován cílový jmenný prostor, provádí se připojení prostřednictvím atributu schemaLocation, který obsahuje název tohoto jmenného prostoru a URL dokumentu, v němž je schéma uloženo. Pokud odpovídající XML schéma jmenný prostor definován nemá, provádí se připojení prostřednictvím atributu <i><b>noNamespaceSchemaLocation</b></i>, který obsahuje pouze URL dokumentu, v němž je schéma uloženo. Všechny prvky XML dokumentu odpovídající tomuto schématu jsou potom uváděny bez prefixu.
           	
           	</p>

<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
      <KorenovyElement xmlns="http://www.pr.cz/MojeSchema" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance" xs:noNamespaceSchemaLocation="mojeSchema02.xsd">
      </KorenovyElement>
  </code>
</pre>
</div>
           	
           	
            <h4 id="root">Kořenový element</h4>
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
      <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
                 xmlns="http://www.priklad.cz"
                 xs:targetNamespace="http://www.pr.cz/MojeSchema">
      </xs:schema>
  </code>
</pre>
</div>
            <p>
            Každé XML schéma musí mít právě jeden kořenový element nazvaný schema. Instance tohoto elementu se v XML dokumentu nevyskytují. Na první úrovni se v XML dokumentu vyskytují až jeho potomci.
            Atribut xmlns:xs indikuje, že všechny elementy a atributy s prefixem xs patří do jmenného prostoru jazyka XML Schema (tj. že se jedná o definici XML schématu). Atribut xmlns specifikuje implicitní jmenný prostor (tj. jmenný prostor pro prvky, jejichž název je uveden bez prefixu).
Dalšími atributy elementu schema je možné ovlivňovat celé XML schéma:
			<ul>
				<li>
					<i><b>id</b></i> – identifikátor schématu
				</li>
				<li>
					<i><b>version</b></i> – verze schématu
				</li>
				<li>
					<i><b>xml:lang</b></i> – verze schématu
				</li>
				<li>
					<i><b>finalDefault</b></i> – implicitní hodnota atributu final v celém schématu
				</li>
				<li>
					<i><b>blockDefault</b></i> – implicitní hodnota atributu block v celém schématu
				</li>
				<li>
					<i><b>targetNamespace</b></i> – URI vytvářeného (cílového) jmenného prostoru
				</li>
				<li>
					<i><b>elementFormDefault</b></i> – implicitní hodnota atributu form všech elementů ve schématu
				</li>
				<li>
					<i><b>attributeFormDefault</b></i> – implicitní hodnota atributu form všech atributů ve schématu
				</li>
			</ul>
			<br>
			Element schema může (mimo jiné) obsahovat podelementy include, import a redefine, které umožňují využití již definovaných (tzv. externích) XML schémat. Element include umožňuje zahrnout do cílového jmenného prostoru jmenný prostor externího schématu, element import umožňuje využívat při vytváření XML schématu prvky z externího schématu a element redefine umožňuje tyto prvky předefinovat.
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
      <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
       <xs:include  schemaLocation="JineSchema1.xsd"/>
       <xs:import   namespace="http://www.pr.cz/JinyNamespace"/>
       <xs:redefine schemaLocation="JineSchema2.xsd">
         <xs:simpleType name="Novyzetezec">
           <xs:restriction base="Puvodnízetezec">
             <xs:maxLength value="5"/>
           </xs:restriction>
         </xs:simpleType>
       </xs:redefine>
     </xs:schema>
  </code>
</pre>
</div>
			<br>
			 Vlastnosti elementu <i><b>include</b></i> ovlivňují atributy:
			<ul>
				<li>
					<i><b>id</b></i> – identifikátor elementu include
				</li>
				<li>
					<i><b>schemaLocation</b></i> – URI schématu, jehož jmenný prostor zahrnujeme
				</li>
			</ul>
			<br>
			Vlastnosti elementu <i><b>import</b></i> ovlivňují atributy:
			<ul>
				<li>
					<i><b>id</b></i> – identifikátor elementu import
				</li>
				<li>
					<i><b>namespace</b></i> – URI jmenného prostoru, jehož prvky využíváme
				</li>
				<li>
					<i><b>schemaLocation</b></i> – URI schématu, jehož prvky využíváme
				</li>
			</ul>
			<br>
			Vlastnosti elementu <i><b>redefine</b></i> ovlivňují atributy:
			<ul>
				<li>
					<i><b>id</b></i> – identifikátor elementu redefine
				</li>
				<li>
					<i><b>namespace</b></i> – URI jmenného prostoru, jehož prvky využíváme
				</li>
				<li>
					<i><b>schemaLocation</b></i> – URI schématu, jehož prvek předefinováváme
				</li>
			</ul>
            </p>
            <h4 id="elements">Elementy</h4>
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:element name="Objednávka" type="TypObjednávky"/>
     <xs:element name="Dárek">
       <xs:complexType>
         <xs:sequence>
           <xs:element name="Narozeniny" type="xs:date"/>
           <xs:element ref="Objednávka"/>
         </xs:sequence>
       </xs:complexType>
     </xs:element>
  </code>
</pre>
</div>
            <p>
            Deklarace elementu je asociace názvu s definicí jednoduchého nebo složeného datového typu a případně implicitní hodnotou.
            <br>
			Vlastnosti elementu ovlivňují atributy elementu <i><b>element</b></i>:
			<ul>
				<li>
					<i><b>id</b></i> – identifikátor elementu
				</li>
				<li>
					<i><b>name</b></i> – název elementu
				</li>
				<li>
					<i><b>type</b></i> – název datového typu elementu
				</li>
				<li>
					<i><b>ref</b></i> – odkaz na globálně deklarovaný element
				</li>
				<li>
					<i><b>nillable</b></i> – příznak, zda smí být instance elementu uvedena bez obsahu
				</li>
				<li>
					<i><b>default</b></i> – implicitní hodnota elementu uvedeného bez obsahu (pro elementy s jednoduchými typy)
				</li>
				<li>
					<i><b>fixed</b></i> – konstantní (jediná možná) hodnota elementu (pro elementy s jednoduchými typy)
				</li>
				<li>
					<i><b>minOccurs</b></i> – minimální nutný počet výskytů elementu
				</li>
				<li>
					<i><b>maxOccurs</b></i> – maximální možný počet výskytů elementu
				</li>
				<li>
					<i><b>form</b></i> – příznak,zdamusíbýtnázevelementuuváděnsprefixemcílového jmenného prostoru (qualified) nebo ne (unqualified)
				</li>
				<li>
					<i><b>abstract</b></i> – příznak, zda je element abstraktní
				</li>
				<li>
					<i><b>substitutionGroup</b></i> – název substituční skupiny elementu
				</li>
				<li>
					<i><b>final</b></i> – v substituční skupině elementu se nesmí vyskytovat elementy, jejichž datové typy byly odvozeny rozšířením (extension), restrikcí (restriction) nebo libovolným způsobem (#all)
				</li>
				<li>
					<i><b>block</b></i> – za daný element není možné substituovat žádné elementy (substitution), elementy, jejichž datové typy byly odvozeny rozšířením (extension), restrikcí (restriction) nebo libovolným způsobem (#all)
				</li>
			</ul>
			
			<h5>Globální a lokální elementy</h5>
			<br>
			Deklarace elementu může být globální nebo lokální (pomocná deklarace v rámci definice složeného typu). Globální element je potomkem elementu schema a je viditelný v rámci celého XML schématu. Na takový element se můžeme dále odkazovat (atributem ref), čímž umožníme, aby se vyskytoval v kontextu aktuálního elementu a byl tak opakovaně využíván.
			<br>
			<h5>Substituce</h5>
			
			
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:element name="Komentář"   type="xs:string"
                 abstract="true"/>
     <xs:element name="Komentář_1" type="xs:string"
                 substitutionGroup="Komentář"/>
     <xs:element name="Komentář_2" type="xs:string"
                 substitutionGroup="Komentář"/>
  </code>
</pre>
</div>
			
			Elementy obsahují mechanismus substituce jednoho elementu za druhý. Elementy přiřadíme do substituční skupiny určené názvem vedoucího elementu, čímž umožníme jejich substituci za vedoucí element. Pokud vedoucí element označíme jako abstraktní (abstract), musí být na jeho místo vždy substituován jiný (neabstraktní) element. Vlastnosti substituční skupiny můžeme dále ovlivňovat pomocí atributů final a block. Atributem final ovlivňujeme strukturu substituční skupiny a atributem block substituce pro konkrétní instanci elementu.
Elementy v substituční skupině musí mít (pokud není parametrem final řečeno jinak) stejný typ jako vedoucí element nebo typ od něj odvozený.
			
            </p>
            <h4 id="attributes">Atributy</h4>
            
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:attribute name="Věk" type="xs:positiveInteger"/>
  </code>
</pre>
</div>
           
            <p>
            Deklarace atributu je asociace názvu s definicí jednoduchého datového typu, omezením výskytu a případně implicitní hodnotou.
            <br> Vlastnosti atributu ovlivňují atributy elementu <i><b> attribute</b></i>:
			<ul>
				<li>
					<i><b>id</b></i> – identifikátor atributu
				</li>
				<li>
					<i><b>name</b></i> – název atributu
				</li>
				<li>
					<i><b>type</b></i> – název datového typu atributu
				</li>
				<li>
					<i><b>ref</b></i> – odkaz na globálně deklarovaný atribut
				</li>
				<li>
					<i><b>default</b></i> – implicitní hodnota atributu, není-li v dokumentu uveden
				</li>
				<li>
					<i><b>fixed</b></i> – konstantní (jediná možná) hodnota atributu
				</li>
				<li>
					<i><b>use</b></i> – nepovinný (<b>optional</b>), zakázaný (<b>prohibited</b>) nebo povinný (<b>required</b>) výskyt atributu
				</li>
				<li>
					<i><b>form</b></i> – příznak zda musí být název atributu uváděn s prefixem cílového jmenného prostoru (<b>qualified</b>) nebo ne (<b>unqualified</b>)
				</li>
	
			</ul>
			Podobně jako u elementu můžeme i datový typ atributu určit hodnotou atributu type nebo jako podelement elementu attribute. Stejný princip platí také pro globální a lokální deklarace atributů.
			
            </p>
            
  
            <h4 id="attributegroup">Skupina atributů</h4>
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:attributeGroup name="SkupinaAtributu1">
       <xs:attribute name="Atribut1" type="xs:integer"/>
       <xs:attribute name="Atribut2" type="xs:string"/>
     </xs:attributeGroup>
  </code>
</pre>
</div>
            <p>
            Definice skupiny atributů je asociace názvu s množinou deklarací atributů, umožňující využití stejné skupiny atributů v různých složených typech.
            <br> Vlastnosti atributu ovlivňují atributy elementu <i><b> attributeGroup</b></i>:
			<ul>
				<li>
					<i><b>id</b></i> – identifikátor skupiny atributů
				</li>
				<li>
					<i><b>name</b></i> – název skupiny atributů
				</li>
				<li>
					<i><b>ref</b></i> – odkaz na globálně deklarovanou skupinu atributů
				</li>
			</ul>
			</p>
            
            <h4 id="xpath">Omezení identity</h4>
            <br>
            <p>
            Definice omezení identity je asociace názvu s omezením na unikátnost nebo klíč. Každé omezení identity obsahuje výraz jazyka XPath8, který vybírá množinu prvků (oblast), v níž pro určené prvky (elementy, atributy nebo jejich kombinace) dané omezení platí.
            <br>
            <br>
            Existují tři typy omezení identity:
            <br>
            <h5>Unikátnost (unique)</h5>
            Omezení na unikátnost specifikuje, že musí být hodnota daného elementu, atributu nebo jejich kombinace v rámci dané oblasti unikátní.
            
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:unique name="unikátníISBN">
       <xs:selector xpath="kniha"/>
       <xs:field    xpath="@ISBN"/>
     </xs:unique>
  </code>
</pre>
</div>
            Vlastnosti omezení na unikátnost ovlivňují atributy elementu <b>unique</b>:
            <ul>
            	<li>
            		<i><b>id</b></i> – identifikátor omezení na unikátnost
            	</li>
            	<li>
            		<i><b>name</b></i> – název omezení na unikátnost
            	</li>
            </ul>
            
            Element unique obsahuje právě jeden podelement <b>selector</b> a alespoň jeden podelement <b>field</b>. Element selector určuje množinu prvků (elementů nebo atributů), v rámci níž musí být prvky určené elementem field unikátní.
            <br>
            <br>
            Vlastnosti elementu <b>selector</b> ovlivňují následující atributy:
            <ul>
            	<li>
            		<i><b>id</b></i> – identifikátor elementu selector
            	</li>
            	<li>
            		<i><b>xpath</b></i> – výraz jazyka XPath
            	</li>
            </ul>
             <br>
            Vlastnosti elementu <b>field</b> ovlivňují následující atributy:
            <ul>
            	<li>
            		<i><b>id</b></i> – identifikátor elementu field
            	</li>
            	<li>
            		<i><b>xpath</b></i> – výraz jazyka XPath
            	</li>
            </ul>
            
            <br>
            <h5> Klíč (key)</h5>
            Omezení na klíč specifikuje, že hodnota daného elementu, atributu nebo jejich kombinace musí být v rámci dané oblasti klíčem. Klíč je unikátní, nenulová a vždy definovaná hodnota.
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:key name="klíčemJeCeléJméno">
       <xs:selector xpath="osoba/údaje"/>
       <xs:field    xpath="jméno"/>
       <xs:field    xpath="příjmení"/>
	</xs:key>
  </code>
</pre>
</div>
            Vlastnosti klíče ovlivňují atributy elementu <b>key</b>:
            <ul>
            	<li>
            		<i><b>id</b></i> – identifikátor klíče
            	</li>
            	<li>
            		<i><b>name</b></i> – název klíče
            	</li>
            </ul>
            
            Element key obsahuje podelementy selector a field s obdobným významem jako v případě elementu unique.
            <br>
            <br>
            <h5> Cizí klíč (keyref)</h5>
            Omezení na cizí klíč specifikuje, že hodnota daného elementu, atributu nebo jejich kombinace v rámci dané oblasti odpovídá hodnotě specifikované daným elementem <b>key</b> nebo <b>unique</b>.
            
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:keyref name="klíčemJeCeléJméno">
       <xs:selector xpath="zaměstnanec/osobní"/>
       <xs:field    xpath="jméno"/>
       <xs:field    xpath="příjmení"/>
	</xs:keyref>
  </code>
</pre>
</div>
            
            Vlastnosti klíče ovlivňují atributy elementu <b>keyref</b>:
            <ul>
            	<li>
            		<i><b>id</b></i> – identifikátor cizího klíče
            	</li>
            	<li>
            		<i><b>name</b></i> – název cizího klíče
            	</li>
            	<li>
            		<i><b>refer</b></i> – název elementu key nebo unique
            	</li>
            </ul>
            
            Element keyref obsahuje podelementy selector a field s obdobným významem jako v případě elementu unique.
            </p>
            
            
            <h4 id="anyattribute">Zástupci</h4>
        
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:complexType name="LibovolníHTMLtext">
       <xs:sequence>
         <xs:any namespace="http://www.w3.org/1999/xhtml"
                 minOccurs="1" maxOccurs="unbounded"
                 processContents="lax"/>
       </xs:sequence>
       <xs:anyAttribute namespace="http://www.w3.org/1999/xhtml"/>
     </xs:complexType>
  </code>
</pre>
</div>
            <p>
            Zástupci jsou prvky umožňující vložit na dané místo element (any) nebo atribut (anyAttribute) z určeného jmenného prostoru nezávisle na aktuálním kontextu.
            <br> Vlastnosti elementu <b>any</b> ovlivňují následující atributy:
			<ul>
				<li>
					<i><b>id</b></i> – identifikátor zástupce pro element
				</li>
				<li>
					<i><b>minOccurs</b></i> – minimální nutný počet výskytů zástupce pro element
				</li>
				<li>
					<i><b>maxOccurs</b></i> – maximální nutný počet výskytů zástupce pro element
				</li>
				<li>
					<i><b>namespace</b></i> – určení jmenného prostoru přípustných elementů – URI konkrétního jmenného prostoru, libovolný jmenný prostor (<b>##any</b>), cílový jmenný prostor schématu (<b>##targetNamespace</b>), prostor jiný než cílový jmenný prostor (<b>##other</b>) nebo povolení elementů bez prefixu jmenného prostoru (<b>##local</b>)
				</li>
				<li>
					<i><b>processContents</b></i> – způsob validace zástupců pro elementy – přísná validace zástupců vůči příslušným jmenným prostorům (<b>strict</b>), validace zástupců probíhá pouze vůči známým schématům jmenných prostorů (<b>lax</b>) nebo žádná validace (</b>skip</b>)
				</li>
			</ul>
			<br> Vlastnosti elementu <b>anyAttribute</b> ovlivňují následující atributy:
			<ul>
				<li>
					<i><b>id</b></i> – identifikátor zástupce pro atribut
				</li>
				<li>
					<i><b>namespace</b></i> – určení jmenného prostoru přípustných atributů
				</li>
				<li>
					<i><b>processContents</b></i> – způsob validace zástupců pro atributy
				</li>
			</ul>
			</p>
			
			
			<h4 id="notation">Notace</h4>
    
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
	<xs:notation name="jpeg" public="image/jpeg" system="viewer.exe"/>
  </code>
</pre>
</div>
            <p>
            Deklarace notace je asociace názvu s identifikátorem notace určené pro popis jiných než XML dat v XML dokumentu.
            <br> Vlastnosti notace ovlivňují atributy elementu <b>notation</b>:
			<ul>
				<li>
					<i><b>id</b></i> – identifikátor notace
				</li>
				<li>
					<i><b>name</b></i> – název notace
				</li>
				<li>
					<i><b>public</b></i> – URI veřejného identifikátoru
				</li>
				<li>
					<i><b>system</b></i> – URI systémového identifikátoru
				</li>
			</ul>
			</p>
            <br>
            <h4 id="anotation">Anotace</h4>
          
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
	<xs:annotation>
       <xs:documentation>Informace pro Čtenáře</xs:documentation>
       <xs:appinfo>Informace pro aplikaci</xs:appinfo>
     </xs:annotation>
  </code>
</pre>
</div>
            
            <p>
            Anotace je informace určená pro člověka nebo aplikaci zpracovávající XML dokument. Interpretace této informace není definována.
            <br> Vlastnosti notace ovlivňují atributy elementu <b>anotation</b>:
			<ul>
				<li>
					<i><b>id</b></i> – identifikátor anotace
				</li>
			</ul>
			Element annotation může obsahovat podelementy <b>documentation</b> (informace pro čtenáře) nebo <b>appinfo</b> (informace pro aplikaci).
			<br>
            <br> Element <b>documentation</b> má následující atributy:
			<ul>
				<li>
					<i><b>source</b></i> – URI zdroje informací pro čtenáře
				</li>
				<li>
					<i><b>xml:lang</b></i> – použitý jazyk
				</li>
			</ul>
			
			<br> Element <b>appinfo</b> má následující atributy:
			<ul>
				<li>
					<i><b>source</b></i> – URI zdroje informací pro aplikaci
				</li>
				<li>
					<i><b>xml:lang</b></i> – použitý jazyk
				</li>
			</ul>
			</p>
            
            
            <h4 id="datatypes_basic">Základní vestavěné datové typy:</h4>
            <br>
            <table border="1">
<tr>
<td style="width:150px;"><b>Typ</b></td>
<td><b>Význam</b></td>
</tr>
<tr>
<td><i><b>anyType</b></i></td>
<td>Libovolný typ</td>
</tr>
<tr>
<td><i><b>string</b></i></td>
<td>Řetězec znaků</td>
</tr>
<tr>
<td><i><b>boolean</b></i></td>
<td>Logické hodnoty true a falše, popř. 1 a 0</td>
</tr>
<tr>
<td><i><b>decimal</b></i></td>
<td>Kladné nebo záporné reálné číslo (např. -1.23, 12678967.543233, 210)</td>
</tr>
<tr>
<td><i><b>float</b></i></td>
<td>32-bitové kladné nebo záporné reálné číslo vyjá­dřené pomocí mantisy a exponentu (např. -1E4, 1267.43233E12, 12). Může mít i speciální hodnoty 0, -0, INF, -INF nebo NaN.</td>
</tr>
<tr>
<td><i><b>double</b></i></td>
<td>64-bitové číslo se stejnými vlastnostmi jako float</td>
</tr>
<tr>
<td><i><b>duration</b></i></td>
<td>Časový úsek ve tvaru PnYnMnDTnHnMnS, kde P a T jsou oddělovače, nY znamená n let a pod. (např. -P1347M, P0Y1347M)</td>
</tr>
<tr>
<td><i><b>dateTime</b></i></td>
<td>Datum a čas ve tvaru YYYY-MM-DDThh:mm:ss.ss, kde T je oddělovač, YYYY znamená rok apod.</td>
</tr>
<tr>
<td><i><b>time</b></i></td>
<td>Cas ve tvaru hh:mm:ss.ss</td>
</tr>
<tr>
<td><i><b>date</b></i></td>
<td>Datum ve tvaru YYYY-MM-DD</td>
</tr>
<tr>
<td><i><b>gYearMonth</b></i></td>
<td>Měsíc v roce ve tvaru YYYY-MM</td>
</tr>
<td><i><b>gYear</b></i></td>
<td>Rok ve tvaru YYYY</td>
</tr>
<tr>
<td><i><b>gMonthDay</b></i></td>
<td>Den v měsíci ve tvaru MM-DD</td>
</tr>
<tr>
<td><i><b>gMonth</b></i></td>
<td>Datum ve tvaru YYYY-MM-DD</td>
</tr>
<tr>
<td><i><b>gDay</b></i></td>
<td>Den ve tvaru DD</td>
</tr>
<tr>
<td><i><b>hexBinary</b></i></td>
<td>Hexadecimální číslo</td>
</tr>
<tr>
<td><i><b>base64Binary</b></i></td>
<td>Binární data s kódováním Base64</td>
</tr>
<tr>
<td><i><b>anyURI</b></i></td>
<td>Absolutní nebo relativní URI</td>
</tr>
<tr>
<td><i><b>QName</b></i></td>
<td>XML Qualified Name, tj. řetězec ve tvaru «prefix»: «místní část», kde «prefix» je označení jmen­ného prostoru a «místní část» je prvek patřící do daného jmenného prostoru</td>
</tr>
<tr>
<td><i><b>NOTATION</b></i></td>
<td>Datový typ pro název elementu notation</td>
</tr>
</table>
<br>
<h4 id="datatypes_string">Vestavěné datové typy odvozené od typu string:</h4>
            <br>
            <table border="1">
<tr>
<td style="width:150px;"><b>Typ</b></td>
<td><b>Význam</b></td>
</tr>
<tr>
<td><i><b>normalizedString</b></i></td>
<td>Řetězec (string), který neobsahuje znaky CR, LF a tabulátor</td>
</tr>
<tr>
<td><i><b>token</b></i></td>
<td>Řetězec (normalizedString), který nemá me­zery na začátku ani na na konci a neobsahuje posloupnost mezer delší než jedna</td>
</tr>
<tr>
<td><i><b>language</b></i></td>
<td>Identifikátor jazyka (např. en, en-GB)</td>
</tr>
<tr>
<td><i><b>NMTOKEN</b></i></td>
<td>Jednoslovná hodnota</td>
</tr>
<tr>
<td><i><b>NMTOKENS</b></i></td>
<td>Seznam jednoslovných hodnot</td>
</tr>
<tr>
<td><i><b>Name</b></i></td>
<td>XML Name, tj. řetězec, který smí obsahovat písmena, číslice, pomlčky, podtržítka, dvojtečky a tečky</td>
</tr>
<tr>
<td><i><b>NCName</b></i></td>
<td>XML Name, které nesmí obsahovat dvojtečky</td>
</tr>
<tr>
<td><i><b>ID</b></i></td>
<td>Hodnota jednoznačná v rámci celého schématu</td>
</tr>
<tr>
<td><i><b>IDREF</b></i></td>
<td>Odkaz na hodnotu datového typu ID</td>
</tr>
<tr>
<td><i><b>IDREFS</b></i></td>
<td>Seznam odkazů na hodnoty datového typu ID</td>
</tr>
<tr>
<td><i><b>ENTITY</b></i></td>
<td>Pojmenování entity (prvku) schématu</td>
</tr>
<tr>
<td><i><b>ENTITIES</b></i></td>
<td>Seznam pojmenování entit schématu</td>
</tr>
</table>
<br>
<h4 id="datatypes_decimal">Vestavěné datové typy odvozené od typu decimal:</h4>
            <br>
            <table border="1">
<tr>
<td style="width:150px;"><b>Typ</b></td>
<td><b>Význam</b></td>
</tr>
<tr>
<td><i><b>integer</b></i></td>
<td>Kladné nebo záporné celé číslo</td>
</tr>
<tr>
<td><i><b>positivelnteger</b></i></td>
<td>Kladné celé číslo</td>
</tr>
<tr>
<td><i><b>negativeInteger</b></i></td>
<td>Záporné celé číslo</td>
</tr>
<tr>
<td><i><b>nonPositivelnteger</b></i></td>
<td>Nekladné celé číslo</td>
</tr>
<tr>
<td><i><b>nonNegativelnteger</b></i></td>
<td>Nezáporné celé číslo</td>
</tr>
<tr>
<td><i><b>long</b></i></td>
<td>Celé číslo z intervalu &lt;-2<sup>63</sup>,  2<sup>63</sup> - 1&gt;</td>
</tr>
<tr>
<td><i><b>int</b></i></td>
<td>Celé číslo z intervalu &lt;-2<sup>31</sup>,  2<sup>31</sup> - 1&gt;</td>
</tr>
<tr>
<td><i><b>short</b></i></td>
<td>Celé číslo z intervalu &lt;-2<sup>15</sup>,  2<sup>15</sup> - 1&gt;</td>
</tr>
<tr>
<td><i><b>byte</b></i></td>
<td>Celé číslo z intervalu &lt;—2<sup>7</sup>,  2<sup>7</sup> — 1&gt;</td>
</tr>
<tr>
<td><i><b>unsignedLong</b></i></td>
<td>Nezáporné číslo menší než 2<sup>64</sup></td>
</tr>
<tr>
<td><i><b>unsignedInt</b></i></td>
<td>Nezáporné číslo menší než 2<sup>32</sup></td>
</tr>
<tr>
<td><i><b>unsignedShort</b></i></td>
<td>Nezáporné číslo menší než 2<sup>16</sup></td>
</tr>
<tr>
<td><i><b>unsignedByte</b></i></td>
<td>Nezáporné číslo menší než 2<sup>8</sup></td>
</tr>
</table>
<br>
<p>
Informace v tabulkách dále upřesňují následující poznámky:
<ul>
<li>Hodnoty typů dateTime, time, dáte, gYearMonth, gYear, gMonthDay, gDay a gMonth lze specifikovat v UTC<sup>7</sup> (např. 15:30:25Z) nebo s od­chylkou od něj (např. 09:30:25+06:00).</li>
<li>Hodnoty typů duration, dateTime, dáte, gMonth a gYear mohou být i záporné.</li>
<li>Vestavěné datové typy pojmenované výhradně velkými písmeny (a typy od nich odvozené) mohou být přiřazeny pouze atributům.</li>
</ul>
</p>


<br>
<h4>Uživatelsky definované typy</h4>
            <br>
            
            <h4 id="restricion">Odvození restrikcí</h4>
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
	<xs:simpleType name="Neprázdnýřetězec">
       <xs:restriction base="xs:string">
         <xs:minLength value="1"/>
       </xs:restriction>
     </xs:simpleType>
  </code>
</pre>
</div>
            
            Pro každý jednoduchý datový typ je defino­vána množina parametrů. Restrikci provádíme nastavením zvolených parametrů na požadované hodnoty. Nový datový typ tedy představuje podmnožinu hodnot původního typu.
            <br>
            <h5>Parametry pro restrikci:</h5>
            <br>
            <table border="1">
<tr>
<td style="width:150px;"><b>Parametr</b></td>
<td><b>Význam</b></td>
</tr>
<tr>
<td><i><b>length</b></i></td>
<td>Počet jednotek daného typu (např. znaků v řetězci)</td>
</tr>
<tr>
<td><i><b>minLength</b></i></td>
<td>Minimální počet jednotek daného typu</td>
</tr>
<tr>
<td><i><b>maxLength</b></i></td>
<td>Maximální počet jednotek daného typu</td>
</tr>
<tr>
<td><i><b>pattern</b></i></td>
<td>Regulární výraz, kterému musí hodnoty daného typu vyhovovat</td>
</tr>
<tr>
<td><i><b>enumeration</b></i></td>
<td>Explicitně vyjmenovaná množina povolených hodnot daného typu</td>
</tr>
<tr>
<td><i><b>whiteSpace</b></i></td>
<td>Zpracování bílých znaků v řetězci – <b>preserve</b> (žádné změny), <b>replace</b> (znaky CR, LF a tabulátor jsou nahrazeny mezerou), <b>collapse</b> (totéž co replace a navíc jsou odstraněny mezery na začátku a na konci řetězce a posloupnosti mezer nahrazeny jednou mezerou)</td>
</tr>
<tr>
<td><i><b>maxInclusive</b></i></td>
<td>Hodnoty datového typu musí být menší nebo rovny zadané hodnotě</td>
</tr>
<tr>
<td><i><b>minInclusive</b></i></td>
<td>Hodnoty datového typu musí být větší nebo rovny zadané hodnotě</td>
</tr>
<tr>
<td><i><b>maxExclusive</b></i></td>
<td>Hodnoty datového typu musí být menší než zadaná hodnota</td>
</tr>
<tr>
<td><i><b>minExclusive</b></i></td>
<td>Hodnoty datového typu musí být větší než zadaná hodnota</td>
</tr>
<tr>
<td><i><b>totalDigits</b></i></td>
<td>Maximální počet cifer</td>
</tr>
<tr>
<td><i><b>fractionDigits</b></i></td>
<td>Maximální počet cifer za desetinnou čárkou</td>
</tr>
</table>
            
            <br> Vlastnosti jednoduchého typu ovlivňují atributy elementu <b>simpleType</b>:
            <br>
            <ul>
            <li><i><b>id</b></i> - identifikátor jednoduchého typu</li>
            <li><i><b>name</b></i> - název jednoduchého typu</li>
            <li><i><b>name</b></i> - z datového typu není možné odvozovat další typy restrikcí (<b>restriction</b>), seznamem (<b>list</b>), sjednocením (<b>union</b>) nebo libovol­ným způsobem (<b>#all</b>)</li>
            </ul>
            <br>
            Vlastnosti odvození restrikcí ovlivňují atributy elementu <b>restriction</b>:
            <ul>
            <li><i><b>id</b></i> - identifikátor restrikce</li>
            <li><i><b>base</b></i> - název datového typu, nad nímž provádíme restrikci</li>
            </ul>
            <br>
            
            
            <h4 id="list">Odvození seznamem</h4>
          
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
	<xs:simpleType name="SeznamReálnýchčísel">
       <xs:list itemType="xs:float"/>
     </xs:simpleType>
  </code>
</pre>
</div>
            Tímto typem odvození vznikne datový typ představující seznam určených datových typů. Jeho hodnota je v XML do­kumentu zadávána jako seznam hodnot oddělených mezerami.
Existují tři vestavěné datové typy odvozené seznamem - <b>NMTOKENS, IDREFS a ENTITIES.</b>
<br>
Vlastnosti odvození seznamem ovlivňují atributy elementu <b>list</b>:
<ul>
            <li><i><b>id</b></i> - dentifikátor odvození seznamem</li>
            <li><i><b>itemType</b></i> - název datového typu, jehož seznam vytváříme</li>
            </ul>
            
            Datový typ, z něhož provádíme odvození seznamem, můžeme určit hod­notou atributu itemType nebo jako podelement elementu list. Odvození seznamem není možné provádět z jiného typu odvozeného seznamem.<br><br>
            

			<h4 id="union">Odvození sjednocením</h4>
          
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
	<xs:simpleType name="SjednoceníTypu">
       <xs:union>
         <xs:simpleType>
           <xs:restriction base="xs:positiveInteger">
             <xs:minInclusive value="8"/>
             <xs:maxInclusive value="72"/>
           </xs:restriction>
         </xs:simpleType>
         <xs:simpleType>
           <xs:restriction base="xs:NMTOKEN">
             <xs:enumeration value="small"/>
             <xs:enumeration value="large"/>
           </xs:restriction>
         </xs:simpleType>
       </xs:union>
     </xs:simpleType>
  </code>
</pre>
</div>
            	Tímto typem odvození vznikne datový typ představující sjednocení hodnot všech určených datových typů. 
            	<br>Vlastnosti odvození sjednocením ovlivňují atributy elementu <b>union</b>:
            	<ul>
            		<li><i><b>id</b></i> - identifikátor jednoduchého typu</li>
            		<li><i><b>memberTypes</b></i> - seznam názvů sjednocovaných typů</li>
            	</ul>
            	
            	
            
            <br>
            <h4 id="complextype">Složené datové typy</h4>
         
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
	<xs:complexType name="Adresa">
       <xs:sequence>
         <xs:element name="Jméno" type="xs:string"/>
         <xs:element name="Ulice" type="xs:string"/>
         <xs:element name="Čdomu" type="xs:unsignedShort"/>
       </xs:sequence>
       <xs:attribute name="Město" type="xs:string"/>
     </xs:complexType>
  </code>
</pre>
</div>
            
            Složený typ je množina deklarací atributů a jednoduchých nebo složených datových typů.
            <br>
            <br>
            Vlastnosti složeného typu ovlivňují atributy elementu <b>complexType</b>:
            <ul>
            	<li><i><b>id</b></i> - identifikátor složeného typu</li>
            	<li><i><b>name</b></i> - název složeného datového typu</li>
            	<li><i><b>mixed</b></i> - příznak smíšeného obsahu (tj. element s daným typem může kromě určených podelementů obsahovat libovolný další text)</li>
            	<li><i><b>abstract</b></i> - příznak, zda je složený typ abstraktní (tj. zda smí být při- řazen některému elementu)</li>
            	<li><i><b>block</b></i> - za element s tímto datovým typem není možné substituovat elementy odvozené restrikcí (<b>restriction</b>), rozšířením (<b>extension</b>) nebo libovolným způsobem (<b>#all</b>)</li>
            	<li><i><b>final</b></i> - z datového typu není možné odvozovat další typy rozšířením (<b>extension</b>), restrikcí (<b>restriction</b>) nebo libovolným způsobem (<b>#all</b>) </li>
            </ul>
            
            
            <br>
            <h4 id="simplecontent"> S jednoduchým obsahem (simpleContent)</h4>
           
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
	 <xs:complexType name="Cena">
       <xs:simpleContent>
         <xs:extension base="xs:decimal">
           <xs:attribute name="Měna" type="xs:string"/>
         </xs:extension>
       </xs:simpleContent>
     </xs:complexType>
  </code>
</pre>
</div>
            
            Datový typ s jednoduchým obsahem obsahuje restrikci (<b>restriction</b>) jednoduchého typu nebo jeho rozšíření (<b>extension</b>) o atributy.
            <br>
            Vlastnosti datového typu s jednoduchým obsahem ovlivňují atributy elementu <b>simpleContent</b>:
            
            <ul>
            <li><i><b>id</b></i> - identifikátor datového typu s jednoduchým obsahem </li>
            </ul>
            
            Vlastnosti rozšíření ovlivňují atributy elementu <b>extension</b>:
            
            <ul>
            <li><i><b>id</b></i> - identifikátor rozšíření </li>
            <li><i><b>base</b></i> - název rozšiřovaného datového typu </li>
            </ul>
            
            
            <br>
            <h4 id="complexcontent">Se složeným obsahem (complexContent)</h4>
           
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
	 <xs:complexType name="Adresa">
       <xs:sequence>
         <xs:element name="ulice" type="xs:string"/>
         <xs:element name="město" type="xs:string"/>
       </xs:sequence>
     </xs:complexType>
  </code>
</pre>
</div>

<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:complexType name="USAdresa">
       <xs:complexContent>
         <xs:extension base="Adresa">
           <xs:sequence>
             <xs:element name="stát" type="xs:string"/>
             <xs:element name="zip"  type="xs:integer"/>
           </xs:sequence>
         </xs:extension>
       </xs:complexContent>
     </xs:complexType>
  </code>
</pre>
</div>
            
            Datový typ se složeným obsahem obsahuje rozšíření nebo restrikci některého z následujících čtyř typů složeného typu. Restrikce znamená vytvoření nového složeného typu, který je podmnožinou typu původního (např. omezením hodnot, omezením počtu výskytů apod.). Rozšířením vznikne složený typ, který obsahuje původní i nový typ (v tomto pořadí).
            <br>
            Vlastnosti datového typu se složeným obsahem ovlivňují atributy elementu <b>complexContent</b>:
            <ul>
            <li><i><b>id</b></i> - identifikátor datového typu se složeným obsahem</li>
            <li><i><b>mixed</b></i> - příznak smíšeného obsahu</li>
            </ul>
            <br>
            Vlastnosti datového typu se složeným obsahem ovlivňují atributy elementu <b>restriction</b>:
            <ul>
            <li><i><b>id</b></i> -  identifikátor restrikce složeného datového typu</li>
            <li><i><b>base</b></i> - název omezovaného datového typu</li>
            </ul>
            
            <br>
            Vlastnosti datového typu se složeným obsahem ovlivňují atributy elementu <b>extension</b>:
            <ul>
            <li><i><b>id</b></i> -  identifikátor rozšíření složeného datového typu</li>
            <li><i><b>base</b></i> - název rozšiřovaného datového typu</li>
            </ul>
            
            
            <br>
            <h4 id="sequence">Posloupnost elementů (sequence)</h4>
          
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:complexType name="Zvířata">
       <xs:sequence minOccurs="0" maxOccurs="unbounded">
         <xs:element ref="Slon"/>
         <xs:element ref="Medvěd"/>
         <xs:element ref="Ží́žala"/>
       </xs:sequence>
     </xs:complexType>
  </code>
</pre>
</div>
            Posloupnost elementů je datový typ obsahující množinu elementů s pevně daným pořadím.
            <br>
            Vlastnosti datového typu se složeným obsahem ovlivňují atributy elementu <b>sequence</b>:
            <ul>
            <li><i><b>id</b></i> -  identifikátor posloupnosti</li>
            <li><i><b>minOccurs</b></i> - minimální nutný počet výskytů posloupnosti</li>
            <li><i><b>maxOccurs</b></i> - maximální možný počet výskytů posloupnosti</li>
            </ul>
            
            
            <br>
            <h4 id="choice">Výběr z elementů (choice)</h4>
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:complexType name="Stav">
       <xs:choice minOccurs="1" maxOccurs="1">
         <xs:element ref="Zvolený"/>
         <xs:element ref="Nezvolený̋"/>
       </xs:choice>
     </xs:complexType>
  </code>
</pre>
</div>
            
            Výběr z elementů je datový typ obsahující jeden element z dané množiny.
            <br>
            Vlastnosti datového typu se složeným obsahem ovlivňují atributy elementu <b>choice</b>:
            <ul>
            <li><i><b>id</b></i> - identifikátor výběru</li>
            <li><i><b>minOccurs</b></i> - minimální nutný počet výskytů výběru</li>
            <li><i><b>maxOccurs</b></i> - maximální možný počet výskytů výběru</li>
            </ul>
            
            
            <br>
            <h4 id="all">Množina elementů (all)</h4>
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:complexType  name="MojeSkupinaVěcí">
       <xs:all>
         <xs:element name="Věc1" type="xs:string"/>
         <xs:element name="Věc2" type="xs:string"/>
       </xs:all>
     </xs:complexType>
  </code>
</pre>
</div>
            
            Množina elementů je datový typ obsahující množinu elementů s libovolným pořadím.
            <br>
            Vlastnosti datového typu se složeným obsahem ovlivňují atributy elementu <b>all</b>:
            <ul>
            <li><i><b>id</b></i> - identifikátor množiny elementů</li>
            <li><i><b>minOccurs</b></i> - minimální nutný počet výskytů množiny elementů</li>
            <li><i><b>maxOccurs</b></i> - maximální možný počet výskytů množiny elementů</li>
            </ul>
            
            
            <br>
            <h4 id="group">Modelová skupina (group)</h4>
            
<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:group name="MojeSkupinaVěcí">
       <xs:all>
         <xs:element name="Věc1" type="xs:string"/>
         <xs:element name="Věc2" type="xs:string"/>
       </xs:all>
</xs:group>
  </code>
</pre>
</div>

<div style="width:600px;">         
  <pre class="xmlsew_example">
  <code>
     <xs:complexType name="MujKomplexníTyp">
       <xs:group     ref="MojeSkupinaVěcí"/>
       <xs:attribute name="MujAtribut" type="xs:decimal"/>
     </xs:complexType>
  </code>
</pre>
</div>
            
            Modelová skupina je datový typ, který jako podelement obsahuje element <b>choice</b>, <b>sequence</b> nebo <b>all</b>, tj. skupinu elementů s určitou vlastností.
            <br>
            Vlastnosti datového typu se složeným obsahem ovlivňují atributy elementu <b>group</b>:
            <ul>
            <li><i><b>id</b></i> - identifikátor modelové skupiny</li>
            <li><i><b>name</b></i> -  název modelové skupiny</li>
            <li><i><b>ref</b></i> - odkaz na globálně deklarovanou modelovou skupinu</li>
            <li><i><b>minOccurs</b></i> - minimální nutný počet výskytů modelové skupiny</li>
            <li><i><b>maxOccurs</b></i> - maximální možný počet výskytů modelové skupiny</li>
            </ul>
            
            Výhodou (a důvodem existence) modelové skupiny je, že je vždy deklarována globálně a tudíž je možné stejnou skupinu elementů opakovaně využívat v různých složených typech.
            <br>
            
</div>
          
         <div style="background-color:black;width:100%;height:55px;">
         </div>
         <div id="gradbar"></div>
