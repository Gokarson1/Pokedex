import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PokeDex Flutter',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: const PokePage(),
    );
  }
}

class PokePage extends StatefulWidget {
  const PokePage();

  @override
  State<PokePage> createState() => _PokePageState();
}

class _PokePageState extends State<PokePage> {
  final TextEditingController _controller = TextEditingController();
  Map<String, dynamic>? pokemonData;
  String? error;

  Future<void> fetchPokemon(String name) async {
    final url = Uri.parse('http://10.0.2.2:3001/api/pokemon/$name'); // Para Android emulador
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        setState(() {
          pokemonData = json.decode(response.body);
          error = null;
        });
      } else {
        setState(() {
          error = 'Pokémon no encontrado';
          pokemonData = null;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Error de red';
        pokemonData = null;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Flutter Pokédex')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _controller,
              decoration: const InputDecoration(
                labelText: 'Nombre del Pokémon',
              ),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () => fetchPokemon(_controller.text.toLowerCase()),
              child: const Text('Buscar'),
            ),
            const SizedBox(height: 20),
            if (error != null)
              Text(error!, style: const TextStyle(color: Colors.red)),
            if (pokemonData != null)
              Column(
                children: [
                  Text(pokemonData!['name'],
                      style: const TextStyle(fontSize: 24)),
                  Image.network(
                      pokemonData!['sprites']['front_default'] ?? ''),
                  Text("Peso: ${pokemonData!['weight']}"),
                  Text("Altura: ${pokemonData!['height']}"),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
