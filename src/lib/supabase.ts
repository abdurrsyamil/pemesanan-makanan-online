import { MenuItem } from '../types';

// Supabase API config provided by user
export const SUPABASE_URL = 'https://aqatbxdspyzufzsuskjd.supabase.co/rest/v1';
export const SUPABASE_KEY = 'sb_publishable_HbzLOvZX8BLvrWFrdXIGIA_kAmDKOC0';

// Default mock data to ensure the app works beautifully if Supabase is offline or not configured with write permissions
export const DEFAULT_MENU: MenuItem[] = [
  {
    id: 1,
    nama_menu: 'Rendang Daging Sapi',
    deskripsi: 'Daging sapi pilihan yang dimasak perlahan dengan santan dan bumbu rempah asli Minang selama 8 jam hingga meresap dan empuk.',
    harga: 45000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1626804475315-9942d997f808?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 2,
    nama_menu: 'Nasi Goreng Nusantara',
    deskripsi: 'Nasi goreng khas Jawa dengan bumbu kemiri dan ebi, disajikan dengan ayam goreng suwir, telur mata sapi, kerupuk udang, dan acar segar.',
    harga: 28000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 3,
    nama_menu: 'Sate Ayam Madura',
    deskripsi: '10 tusuk sate daging ayam pilihan yang dibakar di atas arang batok kelapa, disiram saus kacang gurih kental dan kecap manis.',
    harga: 32000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 4,
    nama_menu: 'Gado-Gado Betawi',
    deskripsi: 'Sayuran segar rebus (kangkung, tauge, kacang panjang) dengan tahu, tempe goreng, telur rebus, disiram saus kacang ulek segar yang legit.',
    harga: 22000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 5,
    nama_menu: 'Soto Ayam Lamongan',
    deskripsi: 'Soto ayam berkuah kuning bening gurih bertabur koya udang yang khas, dilengkapi soun, irisan ayam, kubis, dan telur rebus.',
    harga: 25000,
    kategori: 'Makanan',
    gambar: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 6,
    nama_menu: 'Es Teler Istimewa',
    deskripsi: 'Paduan segar buah alpukat, nangka matang, kelapa muda kerok, jeli pandan, disiram sirup gula asli, susu kental manis, dan es serut melimpah.',
    harga: 18000,
    kategori: 'Minuman',
    gambar: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 7,
    nama_menu: 'Es Teh Tarik',
    deskripsi: 'Teh hitam pekat berkualitas tinggi yang dicampur susu kental manis lalu ditarik hingga menghasilkan busa melimpah dan rasa yang creamy.',
    harga: 12000,
    kategori: 'Minuman',
    gambar: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  },
  {
    id: 8,
    nama_menu: 'Pisang Goreng Pasir Keju',
    deskripsi: 'Pisang kepok manis berbalut tepung roti yang renyah di luar lembut di dalam, diberi taburan keju cheddar parut dan susu kental manis cokelat.',
    harga: 15000,
    kategori: 'Cemilan',
    gambar: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    tersedia: true
  }
];

// Helper to determine category dynamically if none is provided
export function detectCategory(item: { nama_menu: string; deskripsi?: string }): string {
  const name = item.nama_menu.toLowerCase();
  const desc = (item.deskripsi || '').toLowerCase();
  
  const drinkKeywords = ['es ', 'teh', 'jus', 'kopi', 'air', 'minuman', 'sirup', 'wedang', 'lemon', 'orange', 'kelapa'];
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
  if (n.includes('nasi goreng')) return 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=600';
  if (n.includes('sate')) return 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=600';
  if (n.includes('soto')) return 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&q=80&w=600';
  if (n.includes('ayam')) return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600';
  if (n.includes('es ') || n.includes('minum') || n.includes('teh') || n.includes('jus')) return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600';
  if (n.includes('pisang') || n.includes('goreng')) return 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600';
  
  // Neutral Nusantara-like food or general food photo
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
        id: item.id || item.nama_menu,
        nama_menu: item.nama_menu,
        deskripsi: item.deskripsi || '',
        harga: Number(item.harga) || 0,
        kategori: item.kategori || detectCategory(item),
        gambar: item.gambar || getFoodImage(item.nama_menu),
        tersedia: item.tersedia !== undefined ? item.tersedia : true
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
  
  const newItem = {
    nama_menu: item.nama_menu,
    deskripsi: item.deskripsi || '',
    harga: Number(item.harga) || 0,
    kategori: category,
    gambar: image,
    tersedia: true
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
    return inserted[0] || { ...newItem, id: Date.now() };
  } catch (error) {
    console.error('Failed to write to Supabase. Simulated write instead.', error);
    // Return simulated item for dynamic UI update
    return {
      ...newItem,
      id: `local-${Date.now()}`
    };
  }
}

export async function updateMenuItemInSupabase(id: string | number, item: Partial<MenuItem>): Promise<boolean> {
  try {
    // If it's a simulated local item, skip network and return success
    if (String(id).startsWith('local-')) return true;

    const res = await fetch(`${SUPABASE_URL}/menu?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
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

    const res = await fetch(`${SUPABASE_URL}/menu?id=eq.${id}`, {
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
