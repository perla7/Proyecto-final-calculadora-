// JavaScript Document
agregarEvento(window,'load',iniciarCalculadora,false);
var button='';
var tono=null;
function iniciarCalculadora(){
	console.log('Corriendo');
	button=document.getElementsByTagName('button');
	//alert(button);
	for(var i=0;i<button.length;i++){
		agregarEvento(button[i],'click',detectarBoton,false);
	}
	operaciones=document.getElementById('operaciones');//div donde aparecen las operacion
	entrada=document.getElementById('entrada');//div donde aparecen los valores que se van pulsando
	signo=document.getElementById('signo');
	letraM=document.getElementById('memoria');
	tono=document.getElementById('tono');
}

var captura='';//almacena la ultima captura de numeros
var signos='';//alamcena el ultimo signo ingresado
var c=0;//sirve para detectar si se hace o no una operacion despues de pulsar igual
var ultNumero=0;//contiene el ultimo numero ingresado
var memoria='';//variable para guardar numeros en memoria
var bloquear=false;//variabke para bloquear teclas
var operacion='';//variable para almacenar la operacion que se esta realizando
var porcentaje=100;//porcentaje de ancho de la seccion de la pantalla donde se ven las operaciones
var signo='';//almacena el signo que aparece cuando los caracteres de la pantalla de operaciones exceden el ancho de la pantalla
function detectarBoton(e){
	//console.log('Detectando boton');
	var resultado=0;
	if(e){
		e.preventDefault();
		valor=e.target.value;
	}
	
	if(bloquear==true){//bloquear las teclas cuando hay un error como la divicion entre 0
		console.log('Teclas bloqueadas');
		if(valor=='c'){
			resetear();
		}else{
			tono.play();
		}
	}else{
		if(isNaN(valor)==false || valor=='.'){
			if(signos=='1/x' || signos=='raiz'){
				operaciones.innerHTML='';
			}
			console.log(captura.length);
			
			if(captura.length<=17){
				if(captura.length==17)tono.play();
				captura=captura+valor;//contiene el numero ingresado
			}
			captura=contarCaracteres(captura);
			entrada.innerHTML=captura;//mostrar en pantalla el numero capturado
		
		}else if(valor=='='){
			if(signos=='/' && (entrada.innerHTML==0 || isNaN(entrada.innerHTML))){//si se intenta dividir entre 0
				tono.play();
				entrada.innerHTML='<span class="mensaje">No se puede dividir entre 0</span>';	
				bloquear=true;
				
			}else if(signos=='raiz' || signos=='1/x'){
				operaciones.innerHTML='';
				captura='';		
			
			}else if(isNaN(entrada.innerHTML)==false){
				operaciones.innerHTML=operaciones.innerHTML+entrada.innerHTML;//mostrar en pantalla los caracteres	
				if(c==0){//codigo cuando se obtiene  el resultado por primera vez
					var evaluar=eval(operaciones.innerHTML);//realizar la operacion
					
					if(evaluar!=undefined){
						if(signos!=''){
							operacion=evaluar;
							ultNumero=captura;
							c++;//aumenta a c en 1 lo que indica que ya se obtubo un resultado
						}else{
							operacion=entrada.innerHTML;
						}
						operaciones.innerHTML='';//borra la cadena de caracyteres que representaban la operacion anterior
					}
				}else{//codigo que sigue obteniedno rersuoltados cuando se continua precionando la tecla igual
					if(c==0){
						operacion=entrada.innerHTML;//mostrar el numero ingrsado ya que no hay operacion 
					}else{
						operacion=eval(entrada.innerHTML+signos+ultNumero);//realizar la operacion con el ulñtimo signo ingresado
					}
					operaciones.innerHTML='';//mostrar en panttalla los caracteres
				}
				operacion=contarCaracteres(operacion);
				entrada.innerHTML=operacion;
				captura='';//borrar captura para introducir nuevos datos	
			}
			
		}else if(valor=='c'){//reiniciar todos los valores
			resetear();
			fuenteNormal(entrada);
			
		}else if(valor=='borrar'){//borrar caracter por caracter
			var caracteres=entrada.innerHTML.substring(0,entrada.innerHTML.length-1);//quitar el ultimo caracter en la cadena que aparece en pantalla
			captura=caracteres;//poner en la variable captura los caracteres restantes
			if(caracteres==''){
				entrada.innerHTML=0;
			}else{
				entrada.innerHTML=caracteres;
			}
		
		}else if(valor=='ce'){//borrar la pantalla de abajo
			entrada.innerHTML=0;
			captura='';
			fuenteNormal(entrada);
		
		}else if(valor=='mc'){//borrar la memoria
			memoria='';
			letraM.innerHTML='';//quitar la M
			console.log('Memoria vacia');
		
		}else if(valor=='mr'){//mostrar en pantalla el numero almacenado en memoria
			var cadena=contarCaracteres(memoria);
			entrada.innerHTML=cadena;
			captura='';
			console.log('Leyendo memoria:'+memoria);
			
		}else if(valor=='ms'){	//guardar el numero en pantalla en la memoria
			if(entrada.innerHTML!=0 && entrada.innerHTML!='' ){
				if(entrada.innerHTML.length>17){
					var no=entrada.innerHTML.length-17;
					var cadena=entrada.innerHTML.substring(0,entrada.innerHTML.length-no);
				}else{
					cadena=entrada.innerHTML;
				}
				memoria=cadena;
				letraM.innerHTML='M';
				console.log('Numero en la memoria:'+memoria);
			}
		
		}else if(valor==='m+'){//sumar el numero en pantalla al almacenado en la memoria
			var res=eval(parseFloat(memoria)+parseFloat(entrada.innerHTML));
			var cadena=ajustarCaracteres(res);//ajustar la cadena para gusrdar maximo 17 caracteres en la memoria
			memoria=cadena;
		
		}else if(valor=='m-'){//restar el numero en pantalla al almacenado en la memoria
			var res=eval(memoria-entrada.innerHTML)
			var cadena=ajustarCaracteres(res);//ajustar la cadena para gusrdar maximo 17 caracteres en la memoria
			memoria=cadena;
		
		}else if(valor=='1/x'){//obtener el reciproco de un numero
			if(entrada.innerHTML==0){
				tono.play();
				entrada.innerHTML='<span class="mensaje">No se pueden dividir entre  0</span>';
			}else{
				operaciones.innerHTML='reciproc('+entrada.innerHTML+')';
				var resultado=eval(1/entrada.innerHTML);
				var cadena=contarCaracteres(resultado);//ajustar los caracteres en longitud y tamaño para mostrarlos en pantalla, maximo 17
				entrada.innerHTML=cadena;
				signos='1/x';
				captura='';
			}
		
		}else if(valor=='raiz'){//obtener el reciproco de un numero
			operaciones.innerHTML='sqrt('+entrada.innerHTML+')';
			var resultado=Math.sqrt(parseFloat(entrada.innerHTML));
			var cadena=contarCaracteres(resultado);//ajustar los caracteres en longitud y tamaño para mostrarlos en pantalla, maximo 17
			entrada.innerHTML=cadena;
			captura='';
			signos='raiz';
		
		}else if(valor=='%'){//obtener el porcentaje de un numero
			captura='';
			if(operaciones.innerHTML==''){
				ultNumero=entrada.innerHTML+'*';
			}else{
				if(ultNumero==0){
					ultNumero=operaciones.innerHTML;
				}
			}
			resultado=eval(ultNumero+entrada.innerHTML/100);
			if(resultado.toString().length>5){//si el resultado tiene mas de 5 caracteres redondear decimales
				resultado=resultado.toFixed(2);
			}
			operaciones.innerHTML=ultNumero+resultado;
			ajustarDiv(operaciones,signo);
			entrada.innerHTML=resultado;
		
		}else if(valor=='+-' || valor=='-+'){//cambiar el signo
			if(entrada.innerHTML!=0){
				operaciones.innerHTML='';
				valor=valor.substring(0,1);
				if(entrada.innerHTML.indexOf('+')==-1){
					if(entrada.innerHTML.indexOf('-')==-1){	
						entrada.innerHTML='+'+entrada.innerHTML;	
					}
				}
				if(valor=='+'){
					document.getElementById('+-').value='-+';
					entrada.innerHTML=entrada.innerHTML.replace('+','-');	
				}else if(valor=='-'){
					document.getElementById('+-').value='+-';
					entrada.innerHTML=entrada.innerHTML.replace('-','+');
				}
				
			}else{
				operaciones.innerHTML='negate(0)';
			}
			//entrada.innerHTML='';
			
		}else{
			c=0;
			if(signos=='/' && entrada.innerHTML==0){
				tono.play();
				entrada.innerHTML='<span class="mensaje">No se puede dividir entre 0</span>';	
			}else{
				signos=valor;//guardar el ultimo signo ingresado		
				if(operaciones.innerHTML.length>18){
					//operaciones.style.textAlign='left';
				}
				operaciones.innerHTML=operaciones.innerHTML+entrada.innerHTML+valor;//mostrar en panttalla los caracteres capturados(numeros y signos)
				noCaracteres=operaciones.innerHTML.length;//contar el numero de caracteres de la cadena que sera la operacion
				operacion=operaciones.innerHTML.substring(0,noCaracteres-1);//quitar el ultimo signo de la operacion;
				operacion=eval(operacion);//realizar la operacion
				var cadena=contarCaracteres(operacion);
				entrada.innerHTML=cadena;//mostrar el resultado de la operacion realizada
				captura='';//borrar captura para introducir nuevos numeros
			
			}//reconocer divicion entre 0
		}//reconocer teclas
	}//bloquear teclas
}

//funcion para ajustar los caracteres de la pantalla de arriba
function ajustarDiv(operaciones,signo){
	if(operaciones.innerHTML.length>18){
		(signo.innerHTML=='')?signo.innerHTML='<<':signo;
		px=5.5;//pixeles ocupados por caracter
		var suma=(operaciones.innerHTML.length-18)*5.5;
		console.log(suma);
		porcentaje=porcentaje+suma;
		operaciones.style.width=porcentaje+'%';
	}
}

//funcion para poner la fuente y formato normal
function fuenteNormal(entrada){
	entrada.style.fontSize='23px';
	entrada.style.paddingTop='35px';
}

//funcion para ajustar los caracteres a la pantalla y delimitar el maximo de caracteres que son 17
function contarCaracteres(cadena){
	var cadena=cadena.toString();
	var no=cadena.length;
	//con 23px caben hasta 12 caracteres
	if(no>12 && no<=16){// de 12 caracteres en adelante y menos o igual a 16 carcateres
		entrada.style.paddingTop='40px';
		entrada.style.fontSize='18px';//16 caracteres
	}else if(no>=17){
		entrada.style.paddingTop='41px';
		entrada.style.fontSize='17px';//17 caracteres
		if(no>17){
			no=parseInt(cadena.length)-17;	
			cadena=cadena.substring(0,cadena.length-no);
		}
	}
	//console.log(cadena.length);
	return cadena;
}

//funcion para recortar caracteres de los valores guardados en memoria 
function ajustarCaracteres(cadena){
	var cadena=cadena.toString();
	if(cadena.length>17){
		var no=cadena.innerHTML.length-17;
		var cadena=cadena.innerHTML.substring(0,entrada.innerHTML.length-no);
	}else{
		cadena=cadena;
	}
	return cadena;
}

//funcion para resetear valores 
function resetear(){
	console.log('Reset');
	captura='';//almacena la ultima captura de numeros
	signos='';//alamcena el ultimo signo ingresado
	c=0;//sirve para detectar si se hace o no una operacion despues de pulsar igual
	ultNumero=0;//contiene el ultimo numero ingresado
	operaciones.innerHTML='';//muestra las operaciones en curso
	entrada.innerHTML=0;//muestra captura y resultados
	bloquear=false;//bloqueo de teclas
	signo='';//signo para cuando los caracteres exceden el ancho de la pagina
	fuenteNormal(entrada);
}
function agregarEvento(elemento,evento,funcion,captura){
	if(elemento.addEventListener){
		elemento.addEventListener(evento,funcion,captura);
		return true;
	}else if(elemento.attachEvent){
		elemento.attachEvent(evento,funcion);
		return true;
	}else{
		return false;
	}
}
