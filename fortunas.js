// Fortunas LATAM dashboard — lazy init when tab activates. Original logic from latam_100_wealth_dashboard.
(function(){
  let initialized = false;

  window.initFortunas = function() {
    if (initialized) return;
    if (typeof Chart === 'undefined') return; // chart.js not loaded yet, skip
    initialized = true;
    runDashboard();
  };

  function runDashboard() {
const P=[
{n:"Carlos Slim",b:1940,c:"MX",t:"mag",pts:[{y:1991,w:1.7},{y:1994,w:6.6},{y:1996,w:6.1},{y:2000,w:10.8},{y:2005,w:23.8},{y:2007,w:53.1},{y:2008,w:60.6},{y:2009,w:35},{y:2010,w:53.5},{y:2011,w:74},{y:2013,w:73},{y:2015,w:77.1},{y:2016,w:50},{y:2017,w:54.5},{y:2019,w:64},{y:2020,w:52.1},{y:2021,w:62.8},{y:2022,w:81.2},{y:2023,w:93},{y:2024,w:102},{y:2025,w:90.5},{y:2026,w:125}]},
{n:"Germán Larrea",b:1954,c:"MX",t:"mag",pts:[{y:2007,w:5.2},{y:2008,w:7.5},{y:2010,w:13.9},{y:2011,w:16.1},{y:2013,w:14.1},{y:2015,w:11.2},{y:2017,w:13.1},{y:2019,w:13.3},{y:2021,w:25.9},{y:2022,w:30.8},{y:2025,w:28.6},{y:2026,w:67.1}]},
{n:"Eduardo Saverin",b:1982,c:"BR",t:"tech",pts:[{y:2012,w:2},{y:2014,w:5.3},{y:2017,w:8.1},{y:2019,w:9.7},{y:2021,w:14.6},{y:2022,w:10.6},{y:2024,w:29.6},{y:2025,w:34.5},{y:2026,w:35.9}]},
{n:"Iris Fontbona",b:1943,c:"CL",t:"mag",pts:[{y:2006,w:6},{y:2008,w:10.3},{y:2011,w:17.4},{y:2013,w:12.6},{y:2015,w:10.8},{y:2017,w:12.1},{y:2019,w:15.4},{y:2021,w:23.3},{y:2022,w:22.8},{y:2025,w:25.8},{y:2026,w:52.6}]},
{n:"Vicky Safra",b:1952,c:"BR",t:"mag",pts:[{y:2015,w:14.1},{y:2017,w:15.2},{y:2019,w:16.9},{y:2021,w:15.1},{y:2022,w:16.7},{y:2025,w:18.5},{y:2026,w:26.9}]},
{n:"Jorge Paulo Lemann",b:1939,c:"BR",t:"mag",pts:[{y:2000,w:3.4},{y:2005,w:4.4},{y:2008,w:9},{y:2011,w:19},{y:2014,w:25},{y:2017,w:30},{y:2019,w:24.6},{y:2020,w:14.4},{y:2021,w:16.9},{y:2022,w:15.4},{y:2025,w:16},{y:2026,w:19.8}]},
{n:"David Vélez",b:1982,c:"CO",t:"tech",pts:[{y:2021,w:5.2},{y:2022,w:6.5},{y:2023,w:4.4},{y:2024,w:7.9},{y:2025,w:9},{y:2026,w:14.5}]},
{n:"André Esteves",b:1968,c:"BR",t:"mag",pts:[{y:2010,w:2.5},{y:2011,w:3.5},{y:2013,w:2.7},{y:2019,w:3.2},{y:2021,w:5.8},{y:2025,w:9.3},{y:2026,w:19.4}]},
{n:"Marcel H. Telles",b:1950,c:"BR",t:"mag",pts:[{y:2005,w:2.4},{y:2008,w:5.5},{y:2011,w:10.8},{y:2015,w:12},{y:2017,w:13.5},{y:2019,w:9.9},{y:2021,w:11.5},{y:2025,w:10},{y:2026,w:6.9}]},
{n:"Jorge Moll Filho",b:1946,c:"BR",t:"mag",pts:[{y:2013,w:4.1},{y:2017,w:5.4},{y:2019,w:6.6},{y:2021,w:11.3},{y:2022,w:9.8},{y:2025,w:6},{y:2026,w:11.3}]},
{n:"Ricardo Salinas Pliego",b:1956,c:"MX",t:"mag",pts:[{y:2005,w:3.1},{y:2007,w:6.3},{y:2008,w:10.1},{y:2009,w:4.1},{y:2011,w:17.4},{y:2013,w:9.9},{y:2017,w:11.1},{y:2021,w:12.9},{y:2022,w:12.4},{y:2025,w:4.9},{y:2026,w:3.7}]},
{n:"Carlos A. Sicupira",b:1949,c:"BR",t:"mag",pts:[{y:2005,w:1.7},{y:2008,w:3.5},{y:2011,w:7.3},{y:2015,w:9},{y:2017,w:11.3},{y:2019,w:8.9},{y:2022,w:8.5},{y:2026,w:6.3}]},
{n:"Marcos Galperin",b:1972,c:"AR",t:"tech",pts:[{y:2018,w:2.7},{y:2019,w:2.3},{y:2020,w:4.4},{y:2021,w:6.1},{y:2022,w:4.1},{y:2024,w:6.3},{y:2025,w:7.5},{y:2026,w:7.2}]},
{n:"Luis C. Sarmiento",b:1934,c:"CO",t:"mag",pts:[{y:2005,w:3.3},{y:2008,w:5.6},{y:2011,w:10.5},{y:2013,w:12.4},{y:2015,w:13.4},{y:2017,w:12},{y:2019,w:10.8},{y:2025,w:8.9},{y:2026,w:10}]},
{n:"María A. Aramburuzabala",b:1964,c:"MX",t:"mag",pts:[{y:2006,w:2},{y:2008,w:3.3},{y:2013,w:5},{y:2017,w:5.8},{y:2021,w:5.8},{y:2025,w:9},{y:2026,w:9}]},
{n:"Alberto Baillères",b:1932,c:"MX",t:"mag",pts:[{y:2005,w:5.6},{y:2008,w:8.4},{y:2011,w:10.4},{y:2013,w:16.5},{y:2015,w:8.7},{y:2019,w:7.4},{y:2022,w:6.7}]},
{n:"Alejandro Baillères",b:1970,c:"MX",t:"mag",pts:[{y:2023,w:7},{y:2025,w:9},{y:2026,w:15.4}]},
{n:"Luciano Hang",b:1963,c:"BR",t:"mag",pts:[{y:2019,w:2.2},{y:2021,w:4.8},{y:2022,w:2.7},{y:2025,w:4}]},
{n:"Alceu E. Feldmann",b:1950,c:"BR",t:"mag",pts:[{y:2019,w:2.1},{y:2021,w:5.4},{y:2025,w:5}]},
{n:"Orlando Bravo",b:1970,c:"PR",t:"mag",pts:[{y:2019,w:3},{y:2021,w:8},{y:2022,w:6.3},{y:2025,w:5.5}]},
{n:"Luiza H. Trajano",b:1951,c:"BR",t:"mag",pts:[{y:2019,w:2.4},{y:2021,w:5.3},{y:2022,w:2.3},{y:2025,w:4.2}]},
{n:"Carlos Rodríguez-Pastor",b:1959,c:"PE",t:"mag",pts:[{y:2013,w:2.3},{y:2017,w:4},{y:2019,w:4.1},{y:2021,w:5.3},{y:2025,w:5.3}]},
{n:"Paolo Rocca",b:1953,c:"AR",t:"mag",pts:[{y:2008,w:4},{y:2011,w:3.4},{y:2017,w:3.3},{y:2021,w:5.1},{y:2025,w:3.5},{y:2026,w:7.3}]},
{n:"Andrónico Luksic Craig",b:1954,c:"CL",t:"mag",pts:[{y:2010,w:3.2},{y:2011,w:5.2},{y:2013,w:3.8},{y:2017,w:4.5},{y:2021,w:5.4},{y:2025,w:5.5}]},
{n:"Jaime Gilinski",b:1958,c:"CO",t:"mag",pts:[{y:2010,w:2.3},{y:2013,w:3.2},{y:2017,w:3},{y:2021,w:4.1},{y:2025,w:3.6},{y:2026,w:14.7}]},
{n:"Julio Ponce Lerou",b:1946,c:"CL",t:"mag",pts:[{y:2013,w:2.6},{y:2017,w:3.2},{y:2021,w:4.3},{y:2025,w:3.8},{y:2026,w:3.9}]},
{n:"Horst Paulmann",b:1935,c:"CL",t:"mag",pts:[{y:2008,w:2.9},{y:2011,w:4.2},{y:2013,w:3.5},{y:2017,w:3.1},{y:2021,w:3.5}]},
{n:"Alex Behring",b:1968,c:"BR",t:"mag",pts:[{y:2017,w:3.1},{y:2019,w:4.2},{y:2021,w:7},{y:2022,w:5.1},{y:2025,w:6.5},{y:2026,w:5.8}]},
{n:"Juan F. Beckmann Vidal",b:1940,c:"MX",t:"mag",pts:[{y:2013,w:5.5},{y:2017,w:8.4},{y:2019,w:4.3},{y:2021,w:9}]},
{n:"Alejandro Bulgheroni",b:1944,c:"AR",t:"mag",pts:[{y:2008,w:3.1},{y:2013,w:2.6},{y:2019,w:2.6},{y:2024,w:3.2},{y:2026,w:5.1}]},
{n:"Pedro de Godoy Bueno",b:1988,c:"BR",t:"mag",pts:[{y:2021,w:5.8},{y:2022,w:3},{y:2025,w:3}]},
{n:"Guilherme Benchimol",b:1977,c:"BR",t:"tech",pts:[{y:2020,w:2.2},{y:2021,w:4.8},{y:2022,w:2.6},{y:2025,w:3.2}]},
{n:"Luis Frias",b:1966,c:"BR",t:"tech",pts:[{y:2017,w:2.5},{y:2019,w:3.5},{y:2021,w:4.6},{y:2025,w:4}]},
{n:"Joesley Batista",b:1977,c:"BR",t:"mag",pts:[{y:2017,w:1.5},{y:2019,w:2.2},{y:2021,w:2.9},{y:2025,w:3.5}]},
{n:"Wesley Batista",b:1977,c:"BR",t:"mag",pts:[{y:2017,w:1.5},{y:2019,w:2.2},{y:2021,w:2.9},{y:2025,w:3.5}]},
{n:"Rubens Menin",b:1956,c:"BR",t:"mag",pts:[{y:2017,w:1.2},{y:2019,w:1.5},{y:2021,w:2.2},{y:2025,w:2.5}]},
{n:"Carlos Hank Rhon",b:1967,c:"MX",t:"mag",pts:[{y:2015,w:2},{y:2019,w:3},{y:2025,w:4},{y:2026,w:4.4}]},
{n:"Antonio del Valle Ruiz",b:1936,c:"MX",t:"mag",pts:[{y:2015,w:2.3},{y:2019,w:2.6},{y:2025,w:2.9}]},
{n:"Fernando Chico Pardo",b:1950,c:"MX",t:"mag",pts:[{y:2015,w:1.8},{y:2019,w:2.2},{y:2025,w:2.8},{y:2026,w:3.4}]},
{n:"Maurizio Billi",b:1953,c:"BR",t:"mag",pts:[{y:2019,w:2.5},{y:2021,w:3.9},{y:2025,w:3.5}]},
{n:"Roberto I. Marinho",b:1948,c:"BR",t:"mag",pts:[{y:2005,w:3.4},{y:2010,w:2.7},{y:2015,w:1.3},{y:2021,w:1.8},{y:2025,w:1.8}]},
{n:"Abilio Diniz",b:1937,c:"BR",t:"mag",pts:[{y:2005,w:1.8},{y:2010,w:3.5},{y:2013,w:3.2},{y:2017,w:2.8},{y:2021,w:2.6}]},
{n:"Eduardo Eurnekian",b:1933,c:"AR",t:"mag",pts:[{y:2013,w:1.2},{y:2017,w:1.3},{y:2021,w:1.5},{y:2025,w:1.6},{y:2026,w:4.8}]},
{n:"Gregorio Pérez Companc",b:1934,c:"AR",t:"mag",pts:[{y:2005,w:2},{y:2010,w:1.8},{y:2015,w:2},{y:2021,w:2.5}]},
{n:"Jean-Paul Luksic",b:1967,c:"CL",t:"mag",pts:[{y:2013,w:2.5},{y:2017,w:3},{y:2021,w:3.8},{y:2025,w:4.2}]},
{n:"Álvaro Saieh",b:1950,c:"CL",t:"mag",pts:[{y:2010,w:3.5},{y:2013,w:2.8},{y:2017,w:2.4},{y:2021,w:2.8}]},
{n:"Bernardo Larraín Matte",b:1970,c:"CL",t:"mag",pts:[{y:2017,w:2},{y:2021,w:2.8},{y:2025,w:3}]},
{n:"Vito Rodríguez",b:1947,c:"PE",t:"mag",pts:[{y:2015,w:1.2},{y:2019,w:1.6},{y:2025,w:2}]},
{n:"Eduardo Hochschild",b:1964,c:"PE",t:"mag",pts:[{y:2013,w:1.2},{y:2017,w:1.4},{y:2025,w:1.6}]},
{n:"Enrique Coppel Luken",b:1957,c:"MX",t:"mag",pts:[{y:2019,w:1.5},{y:2025,w:2}]},
{n:"Rubens Ometto",b:1951,c:"BR",t:"mag",pts:[{y:2017,w:1},{y:2021,w:1.6},{y:2025,w:2}]},
{n:"Jayme Garfinkel",b:1947,c:"BR",t:"mag",pts:[{y:2017,w:1},{y:2021,w:1.4},{y:2025,w:1.5}]},
{n:"Alexandre Grendene",b:1952,c:"BR",t:"mag",pts:[{y:2017,w:1.2},{y:2021,w:1.6},{y:2025,w:1.6}]},
{n:"Samuel Barata",b:1997,c:"BR",t:"mag",pts:[{y:2023,w:1.2},{y:2025,w:1.4}]},
{n:"Amelie Voigt Trejes",b:2005,c:"BR",t:"mag",pts:[{y:2026,w:1}]},
{n:"Sebastián Piñera †",b:1949,c:"CL",t:"mag",pts:[{y:2005,w:1},{y:2010,w:2.2},{y:2013,w:2.5},{y:2017,w:2.7},{y:2021,w:3.2}]},
{n:"Ernesto Bertarelli",b:1965,c:"BR",t:"mag",pts:[{y:2005,w:5.5},{y:2010,w:7},{y:2015,w:8},{y:2021,w:8.5},{y:2025,w:9.5}]},
{n:"Cristina Junqueira",b:1982,c:"BR",t:"tech",pts:[{y:2021,w:1.3},{y:2022,w:0.6},{y:2024,w:1.5},{y:2025,w:2.17},{y:2026,w:1.79}]},
{n:"André Street",b:1983,c:"BR",t:"tech",pts:[{y:2018,w:0.5},{y:2019,w:1.5},{y:2021,w:2.5},{y:2022,w:1.5},{y:2025,w:2}]},
{n:"Marcos Molina",b:1973,c:"BR",t:"mag",pts:[{y:2019,w:0.8},{y:2021,w:1.5},{y:2025,w:1.8}]},
{n:"Lionel Messi",b:1987,c:"AR",t:"sports",pts:[{y:2010,w:0.09},{y:2012,w:0.15},{y:2014,w:0.21},{y:2016,w:0.3},{y:2018,w:0.4},{y:2020,w:0.52},{y:2022,w:0.6},{y:2024,w:0.75},{y:2026,w:0.85}]},
{n:"Neymar Jr.",b:1992,c:"BR",t:"sports",pts:[{y:2014,w:0.04},{y:2016,w:0.09},{y:2018,w:0.19},{y:2020,w:0.2},{y:2022,w:0.27},{y:2024,w:0.35},{y:2025,w:0.35}]},
{n:"Shakira",b:1977,c:"CO",t:"ent",pts:[{y:2005,w:0.06},{y:2008,w:0.1},{y:2012,w:0.2},{y:2016,w:0.25},{y:2020,w:0.3},{y:2024,w:0.4},{y:2025,w:0.4}]},
{n:"Ronaldinho",b:1980,c:"BR",t:"sports",pts:[{y:2005,w:0.04},{y:2007,w:0.08},{y:2010,w:0.1},{y:2015,w:0.08},{y:2020,w:0.005}]},
{n:"Ronaldo Nazário",b:1976,c:"BR",t:"sports",pts:[{y:2002,w:0.04},{y:2005,w:0.08},{y:2010,w:0.16},{y:2015,w:0.25},{y:2020,w:0.35},{y:2024,w:0.45}]},
{n:"Bad Bunny",b:1994,c:"PR",t:"ent",pts:[{y:2019,w:0.008},{y:2021,w:0.03},{y:2023,w:0.06},{y:2025,w:0.1}]},
{n:"J Balvin",b:1985,c:"CO",t:"ent",pts:[{y:2017,w:0.01},{y:2020,w:0.03},{y:2022,w:0.04},{y:2025,w:0.06}]},
{n:"Sofía Vergara",b:1972,c:"CO",t:"ent",pts:[{y:2012,w:0.03},{y:2016,w:0.1},{y:2020,w:0.14},{y:2024,w:0.18}]},
{n:"Martín Migoya",b:1972,c:"AR",t:"tech",pts:[{y:2014,w:0.05},{y:2018,w:0.25},{y:2021,w:0.9},{y:2022,w:0.6},{y:2025,w:0.75}]},
{n:"Pierpaolo Barbieri",b:1990,c:"AR",t:"tech",pts:[{y:2019,w:0.02},{y:2021,w:0.15},{y:2024,w:0.2},{y:2025,w:0.25}]},
{n:"Kun Agüero",b:1988,c:"AR",t:"sports",pts:[{y:2012,w:0.03},{y:2016,w:0.06},{y:2020,w:0.09},{y:2025,w:0.09}]},
{n:"Luis Suárez",b:1987,c:"UY",t:"sports",pts:[{y:2013,w:0.02},{y:2017,w:0.05},{y:2021,w:0.07},{y:2025,w:0.07}]},
{n:"Edinson Cavani",b:1987,c:"UY",t:"sports",pts:[{y:2013,w:0.015},{y:2017,w:0.04},{y:2021,w:0.06},{y:2025,w:0.06}]},
{n:"Diego Forlán",b:1979,c:"UY",t:"sports",pts:[{y:2005,w:0.01},{y:2010,w:0.03},{y:2015,w:0.04}]},
{n:"Canelo Álvarez",b:1990,c:"MX",t:"sports",pts:[{y:2015,w:0.02},{y:2018,w:0.1},{y:2020,w:0.18},{y:2022,w:0.27},{y:2025,w:0.38}]},
{n:"Daddy Yankee",b:1977,c:"PR",t:"ent",pts:[{y:2005,w:0.01},{y:2012,w:0.03},{y:2020,w:0.05},{y:2025,w:0.06}]},
{n:"Di María",b:1988,c:"AR",t:"sports",pts:[{y:2013,w:0.015},{y:2017,w:0.04},{y:2021,w:0.06},{y:2025,w:0.06}]},
{n:"Kaká",b:1982,c:"BR",t:"sports",pts:[{y:2007,w:0.03},{y:2010,w:0.06},{y:2014,w:0.09},{y:2018,w:0.1}]},
{n:"James Rodríguez",b:1991,c:"CO",t:"sports",pts:[{y:2014,w:0.02},{y:2017,w:0.04},{y:2020,w:0.05},{y:2025,w:0.05}]},
{n:"Radamel Falcao",b:1986,c:"CO",t:"sports",pts:[{y:2013,w:0.02},{y:2016,w:0.05},{y:2020,w:0.07},{y:2025,w:0.08}]},
{n:"Marcelo Vieira",b:1988,c:"BR",t:"sports",pts:[{y:2012,w:0.02},{y:2016,w:0.04},{y:2020,w:0.05},{y:2025,w:0.05}]},
{n:"Dani Alves",b:1983,c:"BR",t:"sports",pts:[{y:2010,w:0.02},{y:2015,w:0.05},{y:2019,w:0.07},{y:2022,w:0.07}]},
{n:"Vinicius Jr.",b:2000,c:"BR",t:"sports",pts:[{y:2020,w:0.005},{y:2022,w:0.02},{y:2024,w:0.04},{y:2025,w:0.05}]},
{n:"Lautaro Martínez",b:1997,c:"AR",t:"sports",pts:[{y:2020,w:0.005},{y:2022,w:0.015},{y:2024,w:0.025},{y:2025,w:0.03}]},
{n:"Checo Pérez",b:1990,c:"MX",t:"sports",pts:[{y:2015,w:0.01},{y:2018,w:0.02},{y:2021,w:0.04},{y:2023,w:0.06},{y:2025,w:0.07}]},
{n:"Oscar de la Hoya",b:1973,c:"MX",t:"sports",pts:[{y:2000,w:0.05},{y:2005,w:0.1},{y:2010,w:0.15},{y:2015,w:0.2},{y:2025,w:0.2}]},
{n:"Julio César Chávez",b:1962,c:"MX",t:"sports",pts:[{y:1993,w:0.02},{y:2000,w:0.04},{y:2010,w:0.04},{y:2025,w:0.04}]},
{n:"Thalia",b:1971,c:"MX",t:"ent",pts:[{y:2000,w:0.02},{y:2005,w:0.04},{y:2010,w:0.05},{y:2015,w:0.06},{y:2025,w:0.06}]},
{n:"Juanes",b:1972,c:"CO",t:"ent",pts:[{y:2005,w:0.005},{y:2010,w:0.015},{y:2015,w:0.02},{y:2025,w:0.03}]},
{n:"Residente",b:1978,c:"PR",t:"ent",pts:[{y:2010,w:0.005},{y:2015,w:0.015},{y:2025,w:0.025}]},
{n:"Ozuna",b:1992,c:"PR",t:"ent",pts:[{y:2018,w:0.005},{y:2020,w:0.015},{y:2022,w:0.025},{y:2025,w:0.035}]},
{n:"Maluma",b:1994,c:"CO",t:"ent",pts:[{y:2017,w:0.005},{y:2019,w:0.012},{y:2022,w:0.02},{y:2025,w:0.03}]},
{n:"Karol G",b:1991,c:"CO",t:"ent",pts:[{y:2019,w:0.003},{y:2021,w:0.008},{y:2023,w:0.025},{y:2025,w:0.045}]},
{n:"Rauw Alejandro",b:1993,c:"PR",t:"ent",pts:[{y:2020,w:0.002},{y:2022,w:0.008},{y:2024,w:0.015},{y:2025,w:0.02}]},
{n:"Anitta",b:1993,c:"BR",t:"ent",pts:[{y:2017,w:0.005},{y:2020,w:0.015},{y:2022,w:0.025},{y:2025,w:0.04}]},
{n:"Salma Hayek",b:1966,c:"MX",t:"ent",pts:[{y:2000,w:0.01},{y:2005,w:0.03},{y:2010,w:0.06},{y:2015,w:0.1},{y:2020,w:0.15},{y:2025,w:0.2}]},
{n:"Gael García Bernal",b:1978,c:"MX",t:"ent",pts:[{y:2005,w:0.002},{y:2010,w:0.005},{y:2015,w:0.008},{y:2025,w:0.012}]},
{n:"Eugenio Derbez",b:1961,c:"MX",t:"ent",pts:[{y:2005,w:0.01},{y:2010,w:0.02},{y:2015,w:0.03},{y:2025,w:0.04}]},
{n:"Rubén Blades",b:1948,c:"PA",t:"ent",pts:[{y:1995,w:0.005},{y:2005,w:0.01},{y:2015,w:0.015},{y:2025,w:0.02}]},
{n:"Fher (Maná)",b:1959,c:"MX",t:"ent",pts:[{y:2000,w:0.005},{y:2010,w:0.015},{y:2020,w:0.03},{y:2025,w:0.035}]},
{n:"Gustavo Cerati †",b:1959,c:"AR",t:"ent",pts:[{y:1995,w:0.003},{y:2000,w:0.006},{y:2005,w:0.01},{y:2010,w:0.012}]},
{n:"Maradona †",b:1960,c:"AR",t:"sports",pts:[{y:1986,w:0.005},{y:1990,w:0.015},{y:1995,w:0.01},{y:2000,w:0.005},{y:2010,w:0.003},{y:2020,w:0.001}]},
{n:"Pelé †",b:1940,c:"BR",t:"sports",pts:[{y:1970,w:0.003},{y:1977,w:0.01},{y:1990,w:0.03},{y:2000,w:0.06},{y:2010,w:0.08},{y:2020,w:0.1}]},
{n:"Manny Pacquiao",b:1978,c:"Other",t:"sports",pts:[{y:2008,w:0.03},{y:2010,w:0.08},{y:2015,w:0.15},{y:2020,w:0.19},{y:2025,w:0.22}]},
{n:"Jean Salata",b:1965,c:"CL",t:"mag",pts:[{y:2026,w:8.4}]},
{n:"Fernando Moreira Salles",b:1946,c:"BR",t:"mag",pts:[{y:2026,w:9.9}]},
{n:"Pedro Moreira Salles",b:1959,c:"BR",t:"mag",pts:[{y:2026,w:8.7}]},
,
  {n:"Eduardo Costantini",b:1946,c:"AR",t:"mag",pts:[{y:2026,w:1.3}]},
  {n:"Alejandro Santo Domingo",b:1979,c:"CO",t:"mag",pts:[{y:2026,w:3.3}]},
  {n:"Beatriz Dávila de Santo Domingo",b:1941,c:"CO",t:"mag",pts:[{y:2026,w:4.7}]},
  {n:"Amelie Voigt Trejes",b:2005,c:"BR",t:"mag",pts:[{y:2026,w:1.1}]},
  {n:"Pedro Voigt Trejes",b:2003,c:"BR",t:"mag",pts:[{y:2026,w:1.1}]},
  {n:"Felipe Voigt Trejes",b:2003,c:"BR",t:"mag",pts:[{y:2026,w:1.1}]},
  {n:"Eduardo Voigt Schwartz",b:2001,c:"BR",t:"mag",pts:[{y:2026,w:1.7}]},
  {n:"Mariana Voigt Schwartz",b:2000,c:"BR",t:"mag",pts:[{y:2026,w:1.7}]},
  {n:"Lívia Voigt de Assis",b:2005,c:"BR",t:"mag",pts:[{y:2024,w:1.2},{y:2026,w:1.4}]},
  {n:"Dora Voigt de Assis",b:2007,c:"BR",t:"mag",pts:[{y:2026,w:1.4}]},
  {n:"Delfín Jorge Ezequiel Carballo",b:1982,c:"AR",t:"mag",pts:[{y:2026,w:1.0}]},
  {n:"Lucia Maggi",b:1932,c:"BR",t:"mag",pts:[{y:2022,w:6.9},{y:2025,w:6.6},{y:2026,w:6.6}]}];

const typeColors={mag:["#8b5cf6","#6d28d9","#a78bfa","#4c1d95","#c4b5fd","#7c3aed","#5b21b6"],tech:["#34d399","#059669","#6ee7b7","#047857","#a7f3d0","#10b981","#065f46"],sports:["#f97316","#c2410c","#fdba74","#9a3412","#fed7aa","#ea580c","#7c2d12"],ent:["#f472b6","#be185d","#f9a8d4","#9d174d","#fbcfe8","#ec4899","#831843"]};
const typeLabels={mag:"Magnates",tech:"Tech/Fintech",sports:"Deportistas",ent:"Entretenimiento"};
const cF={"MX":"","BR":"","CL":"","CO":"","AR":"","PE":"","PR":"","UY":"","PA":"","Other":""};
const cN={"MX":"México","BR":"Brasil","CL":"Chile","CO":"Colombia","AR":"Argentina","PE":"Perú","PR":"Puerto Rico","UY":"Uruguay","PA":"Panamá","Other":"Otro"};
const tL={mag:"Magnate",tech:"Tech",sports:"Deporte",ent:"Entretenimiento"};
const typeIdx={mag:0,tech:0,sports:0,ent:0};
P.forEach(p=>{p._ci=typeIdx[p.t]++;});
function getColor(p){const a=typeColors[p.t];return a[p._ci%a.length];}

function interp(pts,th){for(let i=0;i<pts.length;i++){if(pts[i].w>=th){if(i===0)return pts[0].y;const p0=pts[i-1],p1=pts[i];return p0.y+(th-p0.w)/(p1.w-p0.w)*(p1.y-p0.y);}};return null;}

function computeStats(){
  const ths=[{l:"$10M",v:0.01},{l:"$100M",v:0.1},{l:"$500M",v:0.5},{l:"$1B",v:1},{l:"$10B",v:10},{l:"$50B",v:50},{l:"$100B",v:100}];
  const ms=ths.map(th=>{const hits=[];P.forEach(p=>{const yr=interp(p.pts,th.v);if(yr!==null)hits.push({name:p.n,age:Math.round(yr-p.b),year:Math.round(yr),c:p.c,t:p.t});});hits.sort((a,b)=>a.age-b.age);return{label:th.l,count:hits.length,avg:hits.length?Math.round(hits.reduce((s,h)=>s+h.age,0)/hits.length):null,youngest:hits[0]||null,oldest:hits[hits.length-1]||null};});

  const countries={},billC={};
  P.forEach(p=>{countries[p.c]=(countries[p.c]||0)+1;if(Math.max(...p.pts.map(d=>d.w))>=1)billC[p.c]=(billC[p.c]||0)+1;});
  const topC=Object.entries(countries).sort((a,b)=>b[1]-a[1]);
  const topBC=Object.entries(billC).sort((a,b)=>b[1]-a[1]);
  const typeCnt={mag:0,tech:0,sports:0,ent:0},typeMx={mag:0,tech:0,sports:0,ent:0};
  P.forEach(p=>{typeCnt[p.t]++;const mx=Math.max(...p.pts.map(d=>d.w));if(mx>typeMx[p.t])typeMx[p.t]=mx;});
  const peak=P.map(p=>({n:p.n,pk:Math.max(...p.pts.map(d=>d.w))})).sort((a,b)=>b.pk-a.pk);
  let bigG={name:"",gain:0,yr1:0,yr2:0},bigD={name:"",drop:0,yr1:0,yr2:0};
  P.forEach(p=>{for(let i=1;i<p.pts.length;i++){const g=p.pts[i].w-p.pts[i-1].w;if(g>bigG.gain)bigG={name:p.n,gain:g,yr1:p.pts[i-1].y,yr2:p.pts[i].y};const d=p.pts[i-1].w-p.pts[i].w;if(d>bigD.drop)bigD={name:p.n,drop:d,yr1:p.pts[i-1].y,yr2:p.pts[i].y};}});
  const youngest=P.reduce((a,b)=>b.b>a.b?b:a);const oldest=P.reduce((a,b)=>b.b<a.b?b:a);
  const ages=P.map(p=>2026-p.b).sort((a,b)=>a-b);const medAge=ages[Math.floor(ages.length/2)];

  let mg='';
  mg+=mc("Total personas",P.length,"en el dataset");
  mg+=mc("Billonarios",ms[3].count,"alcanzaron $1B");
  mg+=mc("País #1 total",cF[topC[0][0]]+" "+cN[topC[0][0]],topC[0][1]+" personas");
  mg+=mc("País #1 $1B+",cF[topBC[0][0]]+" "+cN[topBC[0][0]],topBC[0][1]+" billonarios");
  mg+=mc("Fortuna máx.",peak[0].n,"$"+Math.round(peak[0].pk)+"B");
  mg+=mc("Edad mediana",medAge+" años","del dataset (2026)");
  mg+=mc("Más joven",youngest.n,(2026-youngest.b)+" años "+cF[youngest.c]);
  mg+=mc("Más viejo",oldest.n,(2026-oldest.b)+" años "+cF[oldest.c]);
  document.getElementById("metricsGrid").innerHTML=mg;

  let tb=`<table><tr><th>Hito</th><th style="text-align:center;">N</th><th style="text-align:center;">Edad prom.</th><th>Más joven</th><th>Más viejo</th></tr>`;
  ms.forEach(m=>{tb+=`<tr><td style="font-weight:500;">${m.label}</td><td style="text-align:center;">${m.count}</td><td style="text-align:center;">${m.avg!==null?m.avg+"a":"—"}</td><td style="font-size:10.5px;">${m.youngest?cF[m.youngest.c]+" "+m.youngest.name+" <span style='color:var(--tx2);'>("+m.youngest.age+"a, ~"+m.youngest.year+")</span>":"—"}</td><td style="font-size:10.5px;">${m.oldest?cF[m.oldest.c]+" "+m.oldest.name+" <span style='color:var(--tx2);'>("+m.oldest.age+"a, ~"+m.oldest.year+")</span>":"—"}</td></tr>`;});
  tb+='</table>';
  document.getElementById("tableWrap").innerHTML=tb;

  let cb='';
  topC.slice(0,8).forEach(([c,n])=>{const bc=billC[c]||0;cb+=`<div style="display:flex;align-items:center;gap:5px;font-size:11px;margin-bottom:4px;"><span style="min-width:65px;">${cF[c]} ${cN[c]}</span><div class="bar-wrap"><div class="bar-fill" style="width:${Math.round(n/P.length*100)}%;"></div></div><span style="min-width:50px;text-align:right;font-size:10px;color:var(--tx2);">${n} (${bc}B)</span></div>`;});
  document.getElementById("countryBars").innerHTML=cb;

  let ci='';
  Object.entries(typeCnt).forEach(([t,n])=>{const wS=typeMx[t]>=1?"$"+Math.round(typeMx[t])+"B":"$"+Math.round(typeMx[t]*1000)+"M";ci+=`<div style="font-size:11px;margin-bottom:5px;display:flex;justify-content:space-between;"><span>${tL[t]}</span><span style="color:var(--tx2);">${n} pers. · max ${wS}</span></div>`;});
  document.getElementById("catInfo").innerHTML=ci;

  document.getElementById("recGain").innerHTML=`<div class="rec-label">Mayor ganancia</div><div class="rec-name" style="color:var(--grn);">${bigG.name}</div><div class="rec-val" style="color:var(--tx2);">+$${bigG.gain.toFixed(1)}B (${bigG.yr1} → ${bigG.yr2})</div>`;
  document.getElementById("recDrop").innerHTML=`<div class="rec-label">Mayor caída</div><div class="rec-name" style="color:var(--red);">${bigD.name}</div><div class="rec-val" style="color:var(--tx2);">-$${bigD.drop.toFixed(1)}B (${bigD.yr1} → ${bigD.yr2})</div>`;

  const slimP=Math.round(peak[0].pk);
  let pv='';
  pv+=pr("#f97316","Messi ($850M, toda su carrera) = <strong>"+(0.85/slimP*100).toFixed(1)+"%</strong> de Slim ($"+slimP+"B)");
  pv+=pr("#f472b6","Karol G ($45M) necesitaría <strong>"+Math.round(slimP/0.045).toLocaleString()+"x</strong> su fortuna para alcanzar a Slim");
  pv+=pr("#60a5fa","3 uruguayos (Suárez+Cavani+Forlán ≈ $170M) = <strong>"+(0.17/slimP*100).toFixed(2)+"%</strong> de Slim");
  pv+=pr("#f87171","Maradona en su pico ($15M) fue <strong>"+Math.round(slimP/0.015).toLocaleString()+"x</strong> menor que Slim hoy");
  pv+=pr("#fbbf24","Ronaldinho pasó de $100M a ~$5M — <strong>perdió el 95%</strong> de su fortuna");
  pv+=pr("#34d399","Billonario LATAM promedio llega al $1B a los <strong>~"+ms[3].avg+" años</strong>");
  document.getElementById("perspDiv").innerHTML=pv;
}
function mc(l,v,s){return `<div class="mc"><div class="lb">${l}</div><div class="vl">${v}</div><div class="sub">${s}</div></div>`;}
function pr(col,txt){return `<div class="persp-row"><span class="dot" style="background:${col};"></span><span>${txt}</span></div>`;}

computeStats();

function getData(f){
  if(f==="all")return P;
  if(f==="top15bill")return P.filter(p=>Math.max(...p.pts.map(d=>d.w))>=5).slice(0,15);
  if(f==="billonly")return P.filter(p=>Math.max(...p.pts.map(d=>d.w))>=1);
  if(f==="millonly")return P.filter(p=>Math.max(...p.pts.map(d=>d.w))<1);
  if(f==="brazil")return P.filter(p=>p.c==="BR");
  if(f==="mexico")return P.filter(p=>p.c==="MX");
  if(f==="argentina")return P.filter(p=>p.c==="AR");
  if(f==="chile")return P.filter(p=>p.c==="CL");
  if(f==="colombia")return P.filter(p=>p.c==="CO");
  if(f==="uruguay")return P.filter(p=>p.c==="UY");
  if(["sports","ent","tech","mag"].includes(f))return P.filter(p=>p.t===f);
  return P;
}

let chart;
function build(){
  const f=document.getElementById("filt").value;
  const logY=document.getElementById("logY").checked;
  const dots=document.getElementById("showDots").checked;
  const data=getData(f);
  document.getElementById("countLabel").textContent=data.length+" personas";
  const gC="rgba(139,92,246,0.06)";const tC="#6b6e80";

  const bw=data.length>60?1.1:data.length>40?1.4:data.length>20?1.8:2.3;
  const pr=dots?(data.length>60?1.6:data.length>40?2:data.length>20?2.5:3.2):0;
  const datasets=data.map(p=>{const col=getColor(p);return{type:"line",label:p.n,data:p.pts.map(d=>({x:d.y,y:d.w})),borderColor:col,backgroundColor:col+"22",borderWidth:bw,hoverBorderWidth:bw+2.2,pointRadius:pr,pointHoverRadius:pr+3,pointHoverBorderWidth:2,pointHoverBorderColor:"#fff",fill:false,tension:0.25,cubicInterpolationMode:"monotone",pointBackgroundColor:col,borderDash:p.t==="sports"?[4,3]:p.t==="ent"?[7,4]:[]};});

  const leg=document.getElementById("leg");leg.innerHTML="";
  Object.entries(typeLabels).forEach(([t,l])=>{const col=typeColors[t][0];const d=t==="sports"?"dashed":t==="ent"?"dotted":"solid";leg.innerHTML+=`<span style="font-weight:500;border-bottom:2px ${d} ${col};padding-bottom:1px;margin-right:8px;font-size:11px;">${l}</span>`;});
  leg.innerHTML+="<br>";
  data.forEach((p,i)=>{const col=getColor(p);const mx=Math.max(...p.pts.map(d=>d.w));const wL=mx>=1?"$"+Math.round(mx)+"B":"$"+Math.round(mx*1000)+"M";leg.innerHTML+=`<span style="display:inline-flex;align-items:center;gap:2px;" onclick="toggle(${i})" id="li${i}"><span style="width:12px;height:2px;border-radius:1px;background:${col};display:inline-block;"></span>${cF[p.c]||""}${p.n} <span style="color:var(--tx3);font-size:8px;">${wL}</span></span>`;});

  const refLines={id:"refLines",beforeDatasetsDraw(chart){if(!logY)return;const{ctx,chartArea:{left,right},scales:{y}}=chart;const refs=[{v:1,l:"$1B",c:"rgba(52,211,153,0.22)"},{v:10,l:"$10B",c:"rgba(167,139,250,0.22)"},{v:100,l:"$100B",c:"rgba(251,191,36,0.22)"}];ctx.save();ctx.setLineDash([4,4]);ctx.lineWidth=1;refs.forEach(r=>{const yp=y.getPixelForValue(r.v);if(yp<y.top||yp>y.bottom)return;ctx.strokeStyle=r.c;ctx.beginPath();ctx.moveTo(left,yp);ctx.lineTo(right,yp);ctx.stroke();ctx.fillStyle=r.c.replace("0.22","0.75");ctx.font="9px 'DM Mono',monospace";ctx.textAlign="left";ctx.fillText(r.l,left+4,yp-3);});ctx.restore();}};
  if(chart)chart.destroy();
  chart=new Chart(document.getElementById("ch"),{type:"line",data:{datasets},plugins:[refLines],options:{
    responsive:true,maintainAspectRatio:false,interaction:{mode:"nearest",intersect:false,axis:"xy"},layout:{padding:{top:10,right:18,bottom:4,left:6}},
    animation:{duration:600,easing:"easeOutQuart"},
    scales:{
      x:{type:"linear",title:{display:true,text:"Año",color:"#a3a6b4",font:{size:12,family:"DM Sans",weight:500},padding:{top:8}},min:1968,max:2027,grid:{color:"rgba(139,92,246,0.06)",tickColor:"transparent"},border:{color:"rgba(139,92,246,0.2)"},ticks:{color:tC,stepSize:5,font:{family:"DM Mono",size:10},padding:6,callback:v=>v%5===0?String(v):""}},
      y:{type:logY?"logarithmic":"linear",title:{display:true,text:"Fortuna neta (USD)",color:"#a3a6b4",font:{size:12,family:"DM Sans",weight:500},padding:{bottom:8}},min:logY?0.0008:0,max:logY?220:130,grid:{color:"rgba(139,92,246,0.06)",tickColor:"transparent"},border:{color:"rgba(139,92,246,0.2)"},ticks:{color:tC,font:{family:"DM Mono",size:10},padding:6,maxTicksLimit:logY?9:8,callback:v=>v>=1?"$"+Math.round(v)+"B":v>=0.01?"$"+Math.round(v*1000)+"M":"$"+(v*1000).toFixed(1)+"M"}}
    },
    plugins:{legend:{display:false},tooltip:{
      backgroundColor:"rgba(10,11,15,0.96)",borderColor:"rgba(139,92,246,0.45)",borderWidth:1,
      titleColor:"#e8e9ed",bodyColor:"#a3a6b4",
      titleFont:{family:"DM Sans",weight:600,size:12},
      bodyFont:{family:"DM Mono",size:11},
      padding:{top:8,bottom:8,left:11,right:11},cornerRadius:8,
      displayColors:true,boxWidth:8,boxHeight:8,boxPadding:5,caretSize:6,
      callbacks:{
        title:c=>{const p=data[c[0].datasetIndex];return `${cF[p.c]||""}${cF[p.c]?" ":""}${p.n}`;},
        beforeBody:c=>{const p=data[c[0].datasetIndex];return `${tL[p.t]} · ${cN[p.c]||""}`;},
        label:c=>{const p=data[c.datasetIndex];const yr=Math.round(c.parsed.x);const age=yr-p.b;const w=c.parsed.y;const wS=w>=1?"$"+w.toFixed(1)+"B":"$"+Math.round(w*1000)+"M";return `  ${yr}  ·  ${age} años  ·  ${wS}`;}
      }
    }}
  }});
}

window.toggle=function(i){const m=chart.getDatasetMeta(i);m.hidden=!m.hidden;document.getElementById("li"+i).style.opacity=m.hidden?"0.25":"1";chart.update();};

// El tab de Fortunas se muestra recién al activarlo; si construimos el Chart antes de que el
// navegador haya calculado el layout del contenedor (#fort-chart, height 680px), Chart.js mide
// un canvas de 0px y su handler interno de resize tira "Cannot read properties of undefined
// (reading 'type')". Diferimos la 1ra construcción dos frames para que el layout esté listo,
// y envolvemos en try/catch para no propagar un error no capturado.
function safeBuild(){ try{ build(); }catch(e){ console.error("fort-chart: fallo al construir el gráfico:",e); const w=document.getElementById("fort-chart"); if(w&&!w.querySelector(".fc-err")){ const d=document.createElement("div"); d.className="fc-err"; d.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#a3a6b4;font-size:14px;text-align:center;padding:20px;"; d.textContent="No se pudo dibujar el gráfico. Probá recargar la página (Ctrl+Shift+R)."; w.appendChild(d); } } }
requestAnimationFrame(()=>requestAnimationFrame(safeBuild));
document.getElementById("filt").addEventListener("change",safeBuild);
document.getElementById("logY").addEventListener("change",safeBuild);
document.getElementById("showDots").addEventListener("change",safeBuild);  }
})();
