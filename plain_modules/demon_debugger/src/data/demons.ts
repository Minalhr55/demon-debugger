// demons.ts - authored content (26 demons + weapons), typed against ./types
import type { Demon, Weapon } from "../types";

export const WEAPONS: Weapon[] = [
  {
    language: "javascript",
    weaponName: "Aetherquill",
    weaponType: "Blade of the Living Script",
    flavor: "A restless sword that runs in every realm it touches. Versatile, quick, and never still.",
  },
  {
    language: "python",
    weaponName: "Serpent's Embrace",
    weaponType: "Catalyst of the Coiled Tongue",
    flavor: "A catalyst that reads minds before they speak. Elegant, indented, and patient as a viper.",
  },
  {
    language: "java",
    weaponName: "Verdant Greatsword",
    weaponType: "The Heavy Brew",
    flavor: "A claymore forged in enterprise halls. Slow to draw, devastating once it lands.",
  },
  {
    language: "c",
    weaponName: "Nullspike",
    weaponType: "Polearm of the Bare Metal",
    flavor: "A polearm with no guard rails. It cuts closest to the machine, and to your own hand.",
  },
];

export const DEMONS: Demon[] = [
  // ===================== JAVASCRIPT =====================
  {
    id: "js-null-pointer-nightmare",
    name: "Null Pointer Nightmare",
    title: "Devourer of the Undefined",
    bugCategory: "Null/Undefined Access",
    difficulty: "easy",
    language: "javascript",
    spriteId: "null_pointer_imp.png",
    codeSnippet: `function getCity(user) {
  return user.address.city;
}`,
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "return user.address?.city;" },
      { id: "b", text: "return user.address.city.toUpperCase();" },
      { id: "c", text: "return user.city.address;" },
    ],
    correctOptionId: "a",
    terminalAnswer: "return user.address?.city;",
    simulationFailOutput: "TypeError: Cannot read properties of undefined (reading 'city')",
    simulationPassOutput: "OK -> returned undefined safely",
    explanation:
      "If user has no address, user.address is undefined and reading .city throws. Optional chaining (?.) returns undefined instead of crashing.",
    lore:
      "It dwells in the hollow places where a value should be and is not. Many a hero reached into the void, only to grasp 'cannot read properties of undefined'.",
    points: 10,
  },
  {
    id: "js-off-by-one-imp",
    name: "Off-by-One Imp",
    title: "Trickster of the Final Step",
    bugCategory: "Loop Boundary",
    difficulty: "easy",
    language: "javascript",
    spriteId: "offbyone_imp.png",
    codeSnippet: `let total = 0;
for (let i = 0; i <= arr.length; i++) {
  total += arr[i];
}`,
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "i < arr.length" },
      { id: "b", text: "i <= arr.length - 2" },
      { id: "c", text: "i += 2" },
    ],
    correctOptionId: "a",
    terminalAnswer: "for (let i = 0; i < arr.length; i++) {",
    simulationFailOutput: "total -> NaN  (arr[arr.length] is undefined)",
    simulationPassOutput: "total -> 42  (every element summed)",
    explanation:
      "Array indices run 0 to length-1. i <= arr.length reads one past the end where the value is undefined. Use i < arr.length.",
    lore:
      "Small of stature, vast in mischief, it always insists on one step more than the path allows. Forever almost right, the most maddening kind of wrong.",
    points: 10,
  },
  {
    id: "js-mutation-demon",
    name: "Mutation Demon",
    title: "Corruptor of Shared State",
    bugCategory: "State Mutation",
    difficulty: "hard",
    language: "javascript",
    spriteId: "mutation_demon.png",
    codeSnippet: `function addRole(user, role) {
  user.roles.push(role);
  return user;
}`,
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "return { ...user, roles: [...user.roles, role] };" },
      { id: "b", text: "return user.roles;" },
      { id: "c", text: "Object.freeze(role);" },
    ],
    correctOptionId: "a",
    terminalAnswer: "return { ...user, roles: [...user.roles, role] };",
    simulationFailOutput: "base.roles mutated -> ['reader','admin']  (original corrupted)",
    simulationPassOutput: "base.roles intact -> ['reader']  (copy returned)",
    explanation:
      "push mutates the original array, so every reference sees the change. Spread into a new object and array to return a copy and leave the original untouched.",
    lore:
      "It does not destroy your data. It shares it, generously, with everyone who ever touched the reference.",
    points: 30,
  },
  {
    id: "js-async-wraith",
    name: "Async Wraith",
    title: "Phantom of the Unawaited",
    bugCategory: "Async Ordering",
    difficulty: "hard",
    language: "javascript",
    spriteId: "async_wraith.png",
    codeSnippet: `async function loadUser(id) {
  const user = fetchUser(id);
  return user.name;
}`,
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "const user = await fetchUser(id);" },
      { id: "b", text: "return Promise.resolve(user.name);" },
      { id: "c", text: "return fetchUser(id).name;" },
    ],
    correctOptionId: "a",
    terminalAnswer: "const user = await fetchUser(id);",
    simulationFailOutput: "name -> undefined  (user is a pending Promise)",
    simulationPassOutput: "name -> 'Aria'  (promise resolved before read)",
    explanation:
      "Without await, user holds a pending Promise, so user.name is undefined. Awaiting resolves the value before it is read.",
    lore:
      "It haunts the space between the call and the answer. Reach too soon and your hand passes through a Promise that has not yet chosen to exist.",
    points: 30,
  },

  // ===================== PYTHON =====================
  {
    id: "py-infinite-loop-incubus",
    name: "Infinite Loop Incubus",
    title: "Warden of the Endless Cycle",
    bugCategory: "Termination",
    difficulty: "medium",
    language: "python",
    spriteId: "infinite_loop_incubus.png",
    codeSnippet: `count = 0
while count < 5:
    print("summoning...")`,
    buggyLineIndex: 2,
    options: [
      { id: "a", text: "add count += 1 inside the loop" },
      { id: "b", text: "change while to if" },
      { id: "c", text: "change count < 5 to count > 5" },
    ],
    correctOptionId: "a",
    terminalAnswer: "count += 1",
    simulationFailOutput: "summoning... summoning... summoning... (never ends)",
    simulationPassOutput: "summoning x5 -> loop terminated",
    explanation:
      "count never changes, so the condition stays true forever. Incrementing count lets it reach 5 and exit.",
    lore:
      "It promises the ritual will end, truly, any moment now. Your CPU fan has heard this promise before.",
    points: 20,
  },
  {
    id: "py-mutable-default-demon",
    name: "Mutable Default Demon",
    title: "Hoarder of Forgotten Lists",
    bugCategory: "State Mutation",
    difficulty: "hard",
    language: "python",
    spriteId: "mutation_demon.png",
    codeSnippet: `def add_item(item, bag=[]):
    bag.append(item)
    return bag`,
    buggyLineIndex: 0,
    options: [
      { id: "a", text: "def add_item(item, bag=None): then bag = bag or []" },
      { id: "b", text: "use bag.copy() before append" },
      { id: "c", text: "make bag a tuple" },
    ],
    correctOptionId: "a",
    terminalAnswer: "def add_item(item, bag=None):",
    simulationFailOutput: "call1 -> ['a']   call2 -> ['a','b']  (default shared!)",
    simulationPassOutput: "call1 -> ['a']   call2 -> ['b']  (fresh list each call)",
    explanation:
      "A mutable default argument is created once and shared across calls. Use None as the default and build a new list inside.",
    lore:
      "It remembers every guest who ever entered, and seats them all at the same cursed table, call after call.",
    points: 30,
  },
  {
    id: "py-index-banshee",
    name: "Index Banshee",
    title: "Wailer of the Last Element",
    bugCategory: "Loop Boundary",
    difficulty: "easy",
    language: "python",
    spriteId: "boundary_banshee.png",
    codeSnippet: `nums = [10, 20, 30]
for i in range(len(nums) + 1):
    print(nums[i])`,
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "range(len(nums))" },
      { id: "b", text: "range(1, len(nums))" },
      { id: "c", text: "range(len(nums) - 2)" },
    ],
    correctOptionId: "a",
    terminalAnswer: "for i in range(len(nums)):",
    simulationFailOutput: "10 20 30 -> IndexError: list index out of range",
    simulationPassOutput: "10 20 30 -> all printed cleanly",
    explanation:
      "range(len(nums)+1) yields one index too many. range(len(nums)) covers exactly indices 0..len-1.",
    lore:
      "She counts to the edge of the list, then one wail beyond, into the void where no element lives.",
    points: 10,
  },
  {
    id: "py-equality-trickster",
    name: "Identity Trickster",
    title: "Shapeshifter of Is and Equals",
    bugCategory: "Equality",
    difficulty: "medium",
    language: "python",
    spriteId: "type_coercion_trickster.png",
    codeSnippet: `def check(total):
    if total is 1000:
        return "exact"
    return "off"`,
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "if total == 1000:" },
      { id: "b", text: "if total = 1000:" },
      { id: "c", text: "if total is not 1000:" },
    ],
    correctOptionId: "a",
    terminalAnswer: "if total == 1000:",
    simulationFailOutput: "check(1000) -> 'off'  (is compares identity, not value)",
    simulationPassOutput: "check(1000) -> 'exact'  (== compares value)",
    explanation:
      "'is' tests object identity, which is unreliable for numbers outside the small-int cache. Use == to compare values.",
    lore:
      "It swears two things are the very same soul, when they merely share a face. Identity is not equality.",
    points: 20,
  },

  // ===================== JAVA =====================
  {
    id: "java-string-equals-specter",
    name: "String Equals Specter",
    title: "Shapeshifter of False Equals",
    bugCategory: "Equality",
    difficulty: "medium",
    language: "java",
    spriteId: "type_coercion_trickster.png",
    codeSnippet: `if (name == "admin") {
    grantAccess();
}`,
    buggyLineIndex: 0,
    options: [
      { id: "a", text: 'if (name.equals("admin"))' },
      { id: "b", text: 'if (name === "admin")' },
      { id: "c", text: 'if (name = "admin")' },
    ],
    correctOptionId: "a",
    terminalAnswer: 'if (name.equals("admin")) {',
    simulationFailOutput: "access denied  (== compared references, not text)",
    simulationPassOutput: "access granted  (.equals compared contents)",
    explanation:
      "In Java, == compares object references, not string contents. Use .equals() to compare the actual characters.",
    lore:
      "It wears whatever shape flatters the comparison, swearing two strings are strangers though every letter matches.",
    points: 20,
  },
  {
    id: "java-null-pointer-imp",
    name: "Null Pointer Imp",
    title: "Devourer of the Uninstantiated",
    bugCategory: "Null/Undefined Access",
    difficulty: "easy",
    language: "java",
    spriteId: "null_pointer_imp.png",
    codeSnippet: `String name = map.get("user");
int len = name.length();`,
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "int len = (name != null) ? name.length() : 0;" },
      { id: "b", text: "int len = name.size();" },
      { id: "c", text: "int len = name.length;" },
    ],
    correctOptionId: "a",
    terminalAnswer: "int len = (name != null) ? name.length() : 0;",
    simulationFailOutput: "Exception: NullPointerException at name.length()",
    simulationPassOutput: "len -> 0  (null guarded safely)",
    explanation:
      "map.get returns null when the key is absent, and calling .length() on null throws. Guard for null before the call.",
    lore:
      "It feeds on the gap between declaration and birth, where a name exists but points at nothing.",
    points: 10,
  },
  {
    id: "java-off-by-one-banshee",
    name: "Boundary Banshee",
    title: "Wailer Beyond the Array",
    bugCategory: "Loop Boundary",
    difficulty: "medium",
    language: "java",
    spriteId: "boundary_banshee.png",
    codeSnippet: `int[] arr = new int[5];
for (int i = 0; i <= arr.length; i++) {
    arr[i] = i;
}`,
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "i < arr.length" },
      { id: "b", text: "i <= arr.length - 1 - 1" },
      { id: "c", text: "i = 1" },
    ],
    correctOptionId: "a",
    terminalAnswer: "for (int i = 0; i < arr.length; i++) {",
    simulationFailOutput: "ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5",
    simulationPassOutput: "arr filled [0,1,2,3,4] within bounds",
    explanation:
      "Valid indices are 0..length-1. i <= arr.length writes to index 5 which is out of bounds. Use i < arr.length.",
    lore:
      "She shrieks from the slot just past the fence, where the array was never built to hold her.",
    points: 20,
  },
  {
    id: "java-mutation-demon",
    name: "Aliasing Demon",
    title: "Corruptor of Shared Refs",
    bugCategory: "State Mutation",
    difficulty: "hard",
    language: "java",
    spriteId: "mutation_demon.png",
    codeSnippet: `List<String> copy = original;
copy.add("tainted");`,
    buggyLineIndex: 0,
    options: [
      { id: "a", text: "List<String> copy = new ArrayList<>(original);" },
      { id: "b", text: "List<String> copy = original.clone();" },
      { id: "c", text: "final List<String> copy = original;" },
    ],
    correctOptionId: "a",
    terminalAnswer: "List<String> copy = new ArrayList<>(original);",
    simulationFailOutput: "original also contains 'tainted'  (same reference)",
    simulationPassOutput: "original unchanged  (true copy made)",
    explanation:
      "Assigning the reference does not copy the list; both point to the same object. Construct a new ArrayList from it to copy.",
    lore:
      "It whispers that a new name means a new soul. But the reference is the same beast, wearing two collars.",
    points: 30,
  },

  // ===================== C =====================
  {
    id: "c-array-boundary-banshee",
    name: "Boundary Banshee",
    title: "Wailer Beyond the Array",
    bugCategory: "Loop Boundary",
    difficulty: "hard",
    language: "c",
    spriteId: "boundary_banshee.png",
    codeSnippet: `int arr[5];
for (int i = 0; i <= 5; i++) {
    arr[i] = i;
}`,
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "i < 5" },
      { id: "b", text: "i <= 4 - 1" },
      { id: "c", text: "i = 1" },
    ],
    correctOptionId: "a",
    terminalAnswer: "for (int i = 0; i < 5; i++) {",
    simulationFailOutput: "writing arr[5] -> undefined behavior / segfault",
    simulationPassOutput: "arr filled [0,1,2,3,4] within bounds",
    explanation:
      "arr[5] is out of bounds for a 5-element array (valid 0..4). i <= 5 corrupts memory. Use i < 5.",
    lore:
      "It shrieks from the memory just past the fence, where no array was ever meant to tread.",
    points: 30,
  },
  {
    id: "c-null-deref-imp",
    name: "Null Deref Imp",
    title: "Devourer of the Bare Pointer",
    bugCategory: "Null/Undefined Access",
    difficulty: "medium",
    language: "c",
    spriteId: "null_pointer_imp.png",
    codeSnippet: `int *p = malloc(sizeof(int));
*p = 42;
free(p);`,
    buggyLineIndex: 0,
    options: [
      { id: "a", text: "if (p == NULL) return; before *p = 42;" },
      { id: "b", text: "remove free(p);" },
      { id: "c", text: "use sizeof(int*) in malloc" },
    ],
    correctOptionId: "a",
    terminalAnswer: "if (p == NULL) return;",
    simulationFailOutput: "malloc failed -> writing *p -> segmentation fault",
    simulationPassOutput: "allocation checked -> safe write",
    explanation:
      "malloc can return NULL on failure. Dereferencing NULL crashes. Check the pointer before writing through it.",
    lore:
      "It waits for the one allocation that fails, then feasts on the dereference that never checked.",
    points: 20,
  },
  {
    id: "c-uninitialized-wraith",
    name: "Uninitialized Wraith",
    title: "Phantom of the Garbage Value",
    bugCategory: "Termination",
    difficulty: "medium",
    language: "c",
    spriteId: "async_wraith.png",
    codeSnippet: `int sum;
for (int i = 0; i < n; i++) {
    sum += data[i];
}`,
    buggyLineIndex: 0,
    options: [
      { id: "a", text: "int sum = 0;" },
      { id: "b", text: "int sum = 1;" },
      { id: "c", text: "static int sum;" },
    ],
    correctOptionId: "a",
    terminalAnswer: "int sum = 0;",
    simulationFailOutput: "sum -> 32766 + garbage  (uninitialized start)",
    simulationPassOutput: "sum -> correct total  (starts from 0)",
    explanation:
      "An uninitialized local holds garbage. Accumulating onto it gives unpredictable results. Initialize sum to 0.",
    lore:
      "It is born from whatever rotted in that memory before. Trust its first value and it betrays you differently each run.",
    points: 20,
  },
  {
    id: "c-assignment-trickster",
    name: "Assignment Trickster",
    title: "Shapeshifter of One Equals",
    bugCategory: "Equality",
    difficulty: "hard",
    language: "c",
    spriteId: "type_coercion_trickster.png",
    codeSnippet: `if (status = 1) {
    launch();
}`,
    buggyLineIndex: 0,
    options: [
      { id: "a", text: "if (status == 1)" },
      { id: "b", text: "if (status := 1)" },
      { id: "c", text: "if (status =! 1)" },
    ],
    correctOptionId: "a",
    terminalAnswer: "if (status == 1) {",
    simulationFailOutput: "launch() always runs  (assignment, always truthy)",
    simulationPassOutput: "launch() runs only when status equals 1",
    explanation:
      "= assigns and evaluates to the assigned value, so the condition is always true. == compares. Use ==.",
    lore:
      "One stroke short of a comparison, it quietly rewrites what it was meant to question.",
    points: 30,
  },
  {
    id: "js-shadow-promise",
    name: "Async Wraith",
    title: "Devourer of Pending Time",
    bugCategory: "Async Ordering",
    difficulty: "easy",
    language: "javascript",
    spriteId: "async_wraith.png",
    codeSnippet: "async function load() {\n  const res = await fetch('/user');\n  const data = res.json();\n  return data.name;\n}",
    buggyLineIndex: 2,
    options: [
      { id: "a", text: "const data = await res.json();" },
      { id: "b", text: "const data = JSON.parse(res);" },
      { id: "c", text: "const data = res.body.json();" },
    ],
    correctOptionId: "a",
    terminalAnswer: "const data = await res.json();",
    simulationFailOutput: "name -> undefined  (data is a pending Promise)",
    simulationPassOutput: "name -> 'Alice'  (json resolved)",
    explanation:
      "res.json() returns a Promise, so reading data.name before it resolves yields undefined. Await res.json() to get the parsed body first.",
    lore:
      "It haunts the space between the call and the answer; reach too soon and your hand passes through a Promise that has not yet chosen to exist.",
    points: 10,
  },
  {
    id: "js-mutant-specter",
    name: "Mutation Demon",
    title: "Architect of Corrupted Shared State",
    bugCategory: "State Mutation",
    difficulty: "hard",
    language: "javascript",
    spriteId: "mutation_demon.png",
    codeSnippet: "const base = { hp: 100 };\nconst player2 = base;\nplayer2.hp = 80;\nreturn base.hp;",
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "const player2 = { ...base };" },
      { id: "b", text: "const player2 = Object.assign(base);" },
      { id: "c", text: "const player2 = base.clone();" },
    ],
    correctOptionId: "a",
    terminalAnswer: "const player2 = { ...base };",
    simulationFailOutput: "base.hp -> 80  (same reference mutated)",
    simulationPassOutput: "base.hp -> 100  (shallow copy made)",
    explanation:
      "Assigning an object to a new variable copies only the reference, so both names point at the same object. Spreading into a new object creates an independent copy.",
    lore:
      "When one flesh is bound to two names, a wound upon the mirror bleeds the original self.",
    points: 30,
  },
  {
    id: "py-void-ghoul",
    name: "Null Pointer Imp",
    title: "Harbinger of the Nonexistent",
    bugCategory: "Null/Undefined Access",
    difficulty: "medium",
    language: "python",
    spriteId: "null_pointer_imp.png",
    codeSnippet: "def get_length(config):\n    return len(config['items'])\nprint(get_length({}))",
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "    return len(config.get('items', []))" },
      { id: "b", text: "    return len(config['items'] or [])" },
      { id: "c", text: "    return len(config.setdefault('items'))" },
    ],
    correctOptionId: "a",
    terminalAnswer: "    return len(config.get('items', []))",
    simulationFailOutput: "KeyError: 'items'",
    simulationPassOutput: "0  (missing key defaults to empty list)",
    explanation:
      "Indexing a missing dictionary key raises KeyError. Using .get with a default returns an empty list instead of crashing.",
    lore:
      "It drinks the silence of empty structures, turning a simple query into the absolute collapse of reality.",
    points: 20,
  },
  {
    id: "py-loop-incubus",
    name: "Infinite Loop Incubus",
    title: "Stalker of Eternal Stagnation",
    bugCategory: "Termination",
    difficulty: "hard",
    language: "python",
    spriteId: "infinite_loop_incubus.png",
    codeSnippet: "def process(nodes):\n    while nodes:\n        node = nodes[0]\n        print(node)",
    buggyLineIndex: 2,
    options: [
      { id: "a", text: "        node = nodes.pop(0)" },
      { id: "b", text: "        node = nodes.copy()" },
      { id: "c", text: "        node = nodes[-1]" },
    ],
    correctOptionId: "a",
    terminalAnswer: "        node = nodes.pop(0)",
    simulationFailOutput: "node1 node1 node1 ... (list never shrinks)",
    simulationPassOutput: "node1 node2 -> loop ends",
    explanation:
      "The loop reads nodes[0] but never removes it, so the list stays non-empty forever. pop(0) removes the element so the loop can terminate.",
    lore:
      "Time loops around its twisted finger, trapping the traveler in an unending corridor of identical moments.",
    points: 30,
  },
  {
    id: "java-null-specter",
    name: "Null Pointer Imp",
    title: "Lord of Void References",
    bugCategory: "Null/Undefined Access",
    difficulty: "easy",
    language: "java",
    spriteId: "null_pointer_imp.png",
    codeSnippet: 'String name = null;\nif (name.equals("admin")) {\n    System.out.println("Welcome");\n}',
    buggyLineIndex: 1,
    options: [
      { id: "a", text: 'if ("admin".equals(name)) {' },
      { id: "b", text: 'if (name == "admin") {' },
      { id: "c", text: 'if (name.compareTo("admin") == 0) {' },
    ],
    correctOptionId: "a",
    terminalAnswer: 'if ("admin".equals(name)) {',
    simulationFailOutput: "NullPointerException at name.equals(...)",
    simulationPassOutput: "no match -> handled safely",
    explanation:
      "Calling .equals on a null reference throws NullPointerException. Calling .equals on the non-null literal compares safely even when name is null.",
    lore:
      "It rules the vast domain of nothingness, shattering every crown that dares touch its phantom throne.",
    points: 10,
  },
  {
    id: "java-index-banshee",
    name: "Boundary Banshee",
    title: "Screamer of the Edge",
    bugCategory: "Loop Boundary",
    difficulty: "medium",
    language: "java",
    spriteId: "boundary_banshee.png",
    codeSnippet: "int[] arr = {1, 2, 3};\nfor (int i = 0; i <= arr.length; i++) {\n    System.out.println(arr[i]);\n}",
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "for (int i = 0; i < arr.length; i++) {" },
      { id: "b", text: "for (int i = 0; i < arr.length - 1; i++) {" },
      { id: "c", text: "for (int i = 1; i <= arr.length; i++) {" },
    ],
    correctOptionId: "a",
    terminalAnswer: "for (int i = 0; i < arr.length; i++) {",
    simulationFailOutput: "ArrayIndexOutOfBoundsException: Index 3",
    simulationPassOutput: "1 2 3 -> printed within bounds",
    explanation:
      "Arrays are zero-indexed, so the last element is at length-1. Using <= reads index 3 on a 3-element array, out of bounds. Use <.",
    lore:
      "Her chilling wail echoes at the exact perimeter where existence ends and memory corrupts.",
    points: 20,
  },
  {
    id: "java-type-trickster",
    name: "Type Coercion Trickster",
    title: "Jester of Numeric Shadows",
    bugCategory: "Type Error",
    difficulty: "hard",
    language: "java",
    spriteId: "type_coercion_trickster.png",
    codeSnippet: "int a = 5;\nint b = 2;\ndouble result = a / b;\nSystem.out.println(result);",
    buggyLineIndex: 2,
    options: [
      { id: "a", text: "double result = (double) a / b;" },
      { id: "b", text: "double result = (double) (a / b);" },
      { id: "c", text: "double result = Double.valueOf(a / b);" },
    ],
    correctOptionId: "a",
    terminalAnswer: "double result = (double) a / b;",
    simulationFailOutput: "result -> 2.0  (integer division truncated)",
    simulationPassOutput: "result -> 2.5  (floating-point division)",
    explanation:
      "Both operands are ints, so a / b truncates before assignment. Casting one operand to double forces floating-point division.",
    lore:
      "It alters the weight of numbers in the dark, turning whole truths into fractional lies before your eyes.",
    points: 30,
  },
  {
    id: "c-overflow-banshee",
    name: "Boundary Banshee",
    title: "Warden of the Buffer Wall",
    bugCategory: "Loop Boundary",
    difficulty: "easy",
    language: "c",
    spriteId: "boundary_banshee.png",
    codeSnippet: 'char buf[4];\nstrcpy(buf, "test");\nprintf("%s", buf);',
    buggyLineIndex: 1,
    options: [
      { id: "a", text: 'char buf[5];' },
      { id: "b", text: 'strcpy(buf, "te");' },
      { id: "c", text: 'buf = "test";' },
    ],
    correctOptionId: "a",
    terminalAnswer: "char buf[5];",
    simulationFailOutput: "*** stack smashing detected ***",
    simulationPassOutput: "test  (buffer holds 4 chars + null)",
    explanation:
      "\"test\" needs 5 bytes (4 letters plus the null terminator), but buf[4] holds only 4. Size the buffer to 5 to fit the terminator.",
    lore:
      "Break the walls of memory, and she pours the toxic waste of past allocations into the stack.",
    points: 10,
  },
  {
    id: "c-scope-phantom",
    name: "Mutation Demon",
    title: "Stalker of Dangling Flesh",
    bugCategory: "Scope",
    difficulty: "medium",
    language: "c",
    spriteId: "mutation_demon.png",
    codeSnippet: "int* get_ptr() {\n    int val = 42;\n    return &val;\n}",
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "    static int val = 42;" },
      { id: "b", text: "    return val;" },
      { id: "c", text: "    int *ptr = &val;" },
    ],
    correctOptionId: "a",
    terminalAnswer: "    static int val = 42;",
    simulationFailOutput: "segfault / garbage  (returns address of dead local)",
    simulationPassOutput: "42  (static lives beyond the call)",
    explanation:
      "A local variable is destroyed when the function returns, so its address dangles. Making it static gives it a lifetime beyond the call.",
    lore:
      "It leaves your pointers grasping at ghosts, anchoring them to graves where memory used to live.",
    points: 20,
  },
  {
    id: "c-unsigned-loop-imp",
    name: "Infinite Loop Incubus",
    title: "Architect of the Endless Spiral",
    bugCategory: "Termination",
    difficulty: "hard",
    language: "c",
    spriteId: "infinite_loop_incubus.png",
    codeSnippet: "unsigned int i;\nfor (i = 10; i >= 0; i--) {\n    printf(\"%d\", i);\n}",
    buggyLineIndex: 0,
    options: [
      { id: "a", text: "int i;" },
      { id: "b", text: "unsigned int i = 0;" },
      { id: "c", text: "size_t i;" },
    ],
    correctOptionId: "a",
    terminalAnswer: "int i;",
    simulationFailOutput: "10 9 8 ... 0 4294967295 ... (unsigned wraps around)",
    simulationPassOutput: "10 9 8 ... 0 -> loop ends",
    explanation:
      "An unsigned int can never be negative, so i >= 0 is always true and decrementing past 0 wraps to a huge value. Use a signed int.",
    lore:
      "An engine built without negative skies will climb past the stars when it tries to descend.",
    points: 30,
  },
];

export default DEMONS;
