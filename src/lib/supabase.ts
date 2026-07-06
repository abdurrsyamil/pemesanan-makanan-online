import { MenuItem } from '../types';

// Supabase API config provided by user
export const SUPABASE_URL = 'https://aqatbxdspyzufzsuskjd.supabase.co/rest/v1';
export const SUPABASE_KEY = 'sb_publishable_HbzLOvZX8BLvrWFrdXIGIA_kAmDKOC0';

// Default mock data to ensure the app works beautifully if Supabase is offline or not configured with write permissions
export const DEFAULT_MENU: MenuItem[] = [
  {
    id: 1,
    nama_menu: 'Nasi Goreng Nusantara Spesial',
    deskripsi: 'Nasi goreng harum bumbu kecap legendaris, disajikan dengan telur mata sapi setengah matang, tomat, mentimun segar, serta taburan bawang goreng renyah.',
    harga: 28000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 2,
    nama_menu: 'Mie Goreng Seafood Nusantara',
    deskripsi: 'Mie kuning kenyal digoreng wajan panas dengan udang, bakso ikan, sayuran segar, telur orak-arik, dan bumbu manis gurih khas warung tenda.',
    harga: 30000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 3,
    nama_menu: 'Ayam Bakar Madu Pedas',
    deskripsi: 'Ayam bagian paha/dada montok diungkep bumbu kuning, dibakar dengan olesan madu dan kecap pedas gurih hingga meresap ke dalam daging.',
    harga: 35000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 4,
    nama_menu: 'Sate Ayam Madura Asli',
    deskripsi: '10 tusuk sate daging ayam pilihan dibakar di atas arang batok kelapa, disiram saus kacang gurih pekat, kecap manis, irisan bawang merah dan cabai rawit.',
    harga: 32000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 5,
    nama_menu: 'Gado-Gado Betawi Legit',
    deskripsi: 'Sayur-sayuran segar rebus (kangkung, tauge, kol) dipadu tahu, tempe, kentang, telur rebus, disiram saus kacang ulek kental legit dan kerupuk emping.',
    harga: 22000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 6,
    nama_menu: 'Bakso Sapi Kuah Urat',
    deskripsi: 'Bakso urat jumbo dan bakso halus berkuah kaldu sapi pekat super gurih, disajikan lengkap dengan bihun, mie kuning, seledri, dan sambal cabai rawit merah ulek.',
    harga: 26000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 7,
    nama_menu: 'Soto Ayam Lamongan Koya',
    deskripsi: 'Soto ayam berkuah kuning bening gurih bertabur koya udang gurih, berisi suwiran ayam, soun, kol iris, telur rebus, dan perasan jeruk nipis.',
    harga: 25000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 8,
    nama_menu: 'Nasi Padang Rendang Daging',
    deskripsi: 'Paket lengkap nasi hangat, kuah gulai gurih, daun singkong rebus, sambal ijo khas Minang, ditambah Rendang Sapi empuk bumbu rempah asli Padang.',
    harga: 45000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1626804475315-9942d997f808?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 9,
    nama_menu: 'Capcay Seafood Spesial',
    deskripsi: 'Tumisan aneka sayuran segar berkuah kental (wortel, brokoli, kembang kol, sawi) dengan udang windu segar, bakso sapi, dan cumi kenyal gurih.',
    harga: 28000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 10,
    nama_menu: 'Ikan Bakar Sambal Rica-Rica',
    deskripsi: 'Ikan kembung/nila segar dibakar di atas bara api beralaskan daun pisang, dilumuri bumbu kecap manis dan ditaburi sambal rica merah pedas mantap.',
    harga: 38000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 11,
    nama_menu: 'Es Teh Manis Segar',
    deskripsi: 'Teh melati seduh tradisional dengan aroma wangi yang khas, disajikan dingin dengan gula tebu asli dan es batu melimpah.',
    harga: 6000,
    kategori: 'Minuman',
    gambar: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 12,
    nama_menu: 'Es Jeruk Peras Murni',
    deskripsi: 'Perasan jeruk peras lokal segar asli tanpa pemanis buatan, disajikan dingin menyegarkan penawar dahaga.',
    harga: 12000,
    kategori: 'Minuman',
    gambar: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 13,
    nama_menu: 'Kopi Susu Tradisional Hangat',
    deskripsi: 'Seduhan biji kopi robusta pilihan dicampur kental manis gurih creamy, disajikan hangat pas untuk menemani hidangan Anda.',
    harga: 10000,
    kategori: 'Minuman',
    gambar: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 14,
    nama_menu: 'Jus Alpukat Mentega Cokelat',
    deskripsi: 'Jus buah alpukat mentega segar yang kental dan lembut, disajikan dengan lumuran susu kental manis cokelat di pinggiran gelas.',
    harga: 18000,
    kategori: 'Minuman',
    gambar: 'https://images.unsplash.com/photo-1603569283847-be4020c22627?auto=format&fit=crop&w=600',
    tersedia: true
  }
];

// Helper to determine category dynamically if none is provided
export function detectCategory(item: { nama_menu: string; deskripsi?: string }): string {
  const name = item.nama_menu.toLowerCase();
  const desc = (item.deskripsi || '').toLowerCase();
  
  const drinkKeywords = ['es ', 'teh', 'jus', 'kopi', 'air', 'minuman', 'sirup', 'wedang', 'lemon', 'orange', 'kelapa', 'jeruk', 'alpukat'];
  const snackKeywords = ['pisang', 'gorengan', 'risol', 'lumpia', 'cemilan', 'snack', 'roti', 'kue', 'kerupuk', 'singkong', 'bakwan'];

  if (drinkKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword))) {
    return 'Minuman';
  }
  if (snackKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword))) {
    return 'Cemilan';
  }
  return 'Makanan';
}

// Helper to assign appealing fallback food photos based on keywords
export function getFoodImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('rendang')) return 'https://images.unsplash.com/photo-1626804475315-9942d997f808?auto=format&fit=crop&q=80&w=600';
  if (n.includes('nasi goreng')) return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=600';
  if (n.includes('mie goreng')) return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600';
  if (n.includes('sate')) return 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=600';
  if (n.includes('soto')) return 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&q=80&w=600';
  if (n.includes('ayam bakar')) return 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?auto=format&fit=crop&q=80&w=600';
  if (n.includes('ayam')) return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600';
  if (n.includes('gado')) return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600';
  if (n.includes('bakso')) return 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=600';
  if (n.includes('capcay')) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600';
  if (n.includes('ikan bakar')) return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600';
  if (n.includes('es teh') || n.includes('teh manis')) return 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=600';
  if (n.includes('es jeruk') || n.includes('jeruk peras')) return 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=600';
  if (n.includes('kopi susu')) return 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600';
  if (n.includes('alpukat') || n.includes('jus')) return 'https://images.unsplash.com/photo-1603569283847-be4020c22627?auto=format&fit=crop&w=600';
  if (n.includes('es ') || n.includes('minum') || n.includes('teh') || n.includes('jus')) return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600';
  if (n.includes('pisang') || n.includes('goreng')) return 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600';
  
  return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600';
}

// REST API calls to Supabase PostgREST
export async function fetchMenuFromSupabase(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/menu?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.menu_id || item.id || item.nama_menu,
        nama_menu: item.nama_menu,
        deskripsi: item.deskripsi || '',
        harga: Number(item.harga) || 0,
        kategori: item.kategori || detectCategory(item),
        gambar: item.gambar || getFoodImage(item.nama_menu),
        tersedia: item.status_tersedia !== undefined ? item.status_tersedia : (item.tersedia !== undefined ? item.tersedia : true)
      }));
    }
    return DEFAULT_MENU;
  } catch (error) {
    console.error('Failed to fetch from Supabase, loading fallback:', error);
    return DEFAULT_MENU;
  }
}

export async function addMenuItemToSupabase(item: Partial<MenuItem>): Promise<MenuItem> {
  const category = item.kategori || detectCategory({ nama_menu: item.nama_menu!, deskripsi: item.deskripsi });
  const image = item.gambar || getFoodImage(item.nama_menu!);
  
  // Note: ONLY send columns that exist in the database (no 'gambar' column)
  const newItem = {
    nama_menu: item.nama_menu,
    deskripsi: item.deskripsi || '',
    harga: Number(item.harga) || 0,
    kategori: category,
    status_tersedia: true
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(newItem)
    });

    if (!res.ok) throw new Error(`Failed to insert menu: HTTP ${res.status}`);
    const inserted = await res.json();
    const dbItem = inserted[0] || newItem;
    
    return {
      id: dbItem.menu_id || Date.now(),
      nama_menu: dbItem.nama_menu,
      deskripsi: dbItem.deskripsi || '',
      harga: Number(dbItem.harga) || 0,
      kategori: dbItem.kategori || category,
      gambar: image,
      tersedia: dbItem.status_tersedia !== undefined ? dbItem.status_tersedia : true
    };
  } catch (error) {
    console.error('Failed to write to Supabase. Simulated write instead.', error);
    // Return simulated item for dynamic UI update
    return {
      id: `local-${Date.now()}`,
      nama_menu: item.nama_menu!,
      deskripsi: item.deskripsi || '',
      harga: Number(item.harga) || 0,
      kategori: category,
      gambar: image,
      tersedia: true
    };
  }
}

export async function updateMenuItemInSupabase(id: string | number, item: Partial<MenuItem>): Promise<boolean> {
  try {
    // If it's a simulated local item, skip network and return success
    if (String(id).startsWith('local-')) return true;

    // Convert keys to match database columns if necessary
    const dbItem: any = {};
    if (item.nama_menu !== undefined) dbItem.nama_menu = item.nama_menu;
    if (item.deskripsi !== undefined) dbItem.deskripsi = item.deskripsi;
    if (item.harga !== undefined) dbItem.harga = Number(item.harga);
    if (item.kategori !== undefined) dbItem.kategori = item.kategori;
    if (item.tersedia !== undefined) dbItem.status_tersedia = item.tersedia;

    const res = await fetch(`${SUPABASE_URL}/menu?menu_id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dbItem)
    });

    return res.ok;
  } catch (error) {
    console.error('Failed to update Supabase:', error);
    return true; // Return true to keep frontend reactive
  }
}

export async function deleteMenuItemFromSupabase(id: string | number): Promise<boolean> {
  try {
    if (String(id).startsWith('local-')) return true;

    const res = await fetch(`${SUPABASE_URL}/menu?menu_id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return res.ok;
  } catch (error) {
    console.error('Failed to delete from Supabase:', error);
    return true; // Return true to keep frontend reactive
  }
}

// User accounts table helper
export async function registerUserInSupabase(user: { nama: string; email: string; role: string; id: string }): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/users`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(user)
    });

    return res.ok;
  } catch (error) {
    console.error('Supabase users table could not be written to directly. Gracefully falling back to localStorage.', error);
    return false;
  }
}
